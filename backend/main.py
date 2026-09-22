"""
Live router throughput backend.

Polls a router's interface byte counters over SNMP (IF-MIB high-capacity
64-bit counters), computes bits-per-second deltas, and pushes them to
connected browser clients over a WebSocket.

Config is read from environment variables (see .env.example).
"""
import asyncio
import json
import os
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pysnmp.hlapi.asyncio import (
    CommunityData,
    ContextData,
    ObjectIdentity,
    ObjectType,
    SnmpEngine,
    UdpTransportTarget,
    getCmd,
)

import storage

# --- Config ------------------------------------------------------------

SNMP_HOST = os.environ.get("SNMP_HOST", "192.168.1.1")
SNMP_PORT = int(os.environ.get("SNMP_PORT", "161"))
SNMP_COMMUNITY = os.environ.get("SNMP_COMMUNITY", "public")
IF_INDEX = int(os.environ.get("IF_INDEX", "1"))  # find via ifDescr/ifIndex walk
POLL_INTERVAL = float(os.environ.get("POLL_INTERVAL", "1.0"))  # seconds

# IF-MIB high-capacity (64-bit) counters, addressed numerically so no MIB
# compilation/lookup is required.
IF_HC_IN_OCTETS = f"1.3.6.1.2.1.31.1.1.1.6.{IF_INDEX}"
IF_HC_OUT_OCTETS = f"1.3.6.1.2.1.31.1.1.1.10.{IF_INDEX}"

# Standard MIB-II sysUpTime (hundredths of a second since last reboot),
# supported by virtually every SNMP agent regardless of vendor.
SYS_UP_TIME = "1.3.6.1.2.1.1.3.0"

# 64-bit counter max, for wraparound handling
COUNTER64_MAX = 2**64


# --- SNMP polling --------------------------------------------------------

snmp_engine = SnmpEngine()


async def snmp_get_counters() -> tuple[int, int, int] | None:
    """Fetch (in_octets, out_octets, uptime_seconds). Returns None on error."""
    errorIndication, errorStatus, errorIndex, varBinds = await getCmd(
        snmp_engine,
        CommunityData(SNMP_COMMUNITY, mpModel=1),  # mpModel=1 -> SNMPv2c
        UdpTransportTarget((SNMP_HOST, SNMP_PORT), timeout=2, retries=1),
        ContextData(),
        ObjectType(ObjectIdentity(IF_HC_IN_OCTETS)),
        ObjectType(ObjectIdentity(IF_HC_OUT_OCTETS)),
        ObjectType(ObjectIdentity(SYS_UP_TIME)),
    )

    if errorIndication:
        print(f"SNMP error: {errorIndication}")
        return None
    if errorStatus:
        print(f"SNMP error: {errorStatus.prettyPrint()}")
        return None

    in_octets = int(varBinds[0][1])
    out_octets = int(varBinds[1][1])
    uptime_seconds = int(varBinds[2][1]) // 100  # TimeTicks -> seconds
    return in_octets, out_octets, uptime_seconds


def compute_bps(prev_octets: int, curr_octets: int, elapsed: float) -> float:
    """Bits-per-second from a counter delta, handling 64-bit wraparound."""
    delta = curr_octets - prev_octets
    if delta < 0:
        # Counter wrapped around
        delta += COUNTER64_MAX
    return (delta * 8) / elapsed if elapsed > 0 else 0.0


# --- WebSocket broadcast ---------------------------------------------------


class ConnectionManager:
    def __init__(self) -> None:
        self.active: set[WebSocket] = set()

    async def connect(self, ws: WebSocket) -> None:
        await ws.accept()
        self.active.add(ws)

    def disconnect(self, ws: WebSocket) -> None:
        self.active.discard(ws)

    async def broadcast(self, message: dict) -> None:
        dead = []
        payload = json.dumps(message)
        for ws in self.active:
            try:
                await ws.send_text(payload)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)


manager = ConnectionManager()


# --- Background polling loop -----------------------------------------------


async def poll_loop() -> None:
    prev = None  # (in_octets, out_octets, timestamp)
    while True:
        start = time.monotonic()
        counters = await snmp_get_counters()
        now = time.time()

        if counters is not None:
            in_octets, out_octets, uptime_seconds = counters
            if prev is not None:
                prev_in, prev_out, prev_ts = prev
                elapsed = now - prev_ts
                rx_bps = compute_bps(prev_in, in_octets, elapsed)
                tx_bps = compute_bps(prev_out, out_octets, elapsed)
                await manager.broadcast(
                    {
                        "ts": now,
                        "rx_bps": rx_bps,
                        "tx_bps": tx_bps,
                        "interface_index": IF_INDEX,
                        "uptime_seconds": uptime_seconds,
                    }
                )

                rx_delta_bytes = in_octets - prev_in
                tx_delta_bytes = out_octets - prev_out
                if rx_delta_bytes < 0:
                    rx_delta_bytes += COUNTER64_MAX
                if tx_delta_bytes < 0:
                    tx_delta_bytes += COUNTER64_MAX
                storage.add_bytes(rx_delta_bytes, tx_delta_bytes)
            prev = (in_octets, out_octets, now)

        # keep a steady cadence regardless of how long the SNMP call took
        elapsed_this_cycle = time.monotonic() - start
        await asyncio.sleep(max(0.0, POLL_INTERVAL - elapsed_this_cycle))


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(poll_loop())
    yield
    task.cancel()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this for production
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "snmp_host": SNMP_HOST, "if_index": IF_INDEX}


@app.get("/usage/today")
async def usage_today():
    return storage.get_today()


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            # We don't expect client messages, but this keeps the
            # connection alive and detects disconnects promptly.
            await ws.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(ws)