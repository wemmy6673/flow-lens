"""
Daily usage tracking.

Accumulates RX/TX bytes into a running total for "today" (local date on
the machine running the backend), persisted to SQLite so it survives
restarts. A new day automatically starts a fresh row — there's no
explicit reset job, the rollover just falls out of keying rows by date.
"""
import datetime
import sqlite3
import threading
from pathlib import Path

DB_PATH = Path(__file__).parent / "usage.db"

_lock = threading.Lock()


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS daily_usage (
            day TEXT PRIMARY KEY,
            rx_bytes INTEGER NOT NULL DEFAULT 0,
            tx_bytes INTEGER NOT NULL DEFAULT 0
        )
        """
    )
    return conn


def _today() -> str:
    return datetime.date.today().isoformat()


def add_bytes(rx_delta: int, tx_delta: int) -> None:
    """Add a poll cycle's byte delta to today's running total."""
    if rx_delta < 0 or tx_delta < 0:
        return  # guard against a bad delta upstream; never subtract usage
    today = _today()
    with _lock:
        conn = _connect()
        try:
            conn.execute(
                """
                INSERT INTO daily_usage (day, rx_bytes, tx_bytes)
                VALUES (?, ?, ?)
                ON CONFLICT(day) DO UPDATE SET
                    rx_bytes = rx_bytes + excluded.rx_bytes,
                    tx_bytes = tx_bytes + excluded.tx_bytes
                """,
                (today, rx_delta, tx_delta),
            )
            conn.commit()
        finally:
            conn.close()


def get_today() -> dict:
    today = _today()
    with _lock:
        conn = _connect()
        try:
            row = conn.execute(
                "SELECT rx_bytes, tx_bytes FROM daily_usage WHERE day = ?",
                (today,),
            ).fetchone()
        finally:
            conn.close()

    rx_bytes, tx_bytes = row if row else (0, 0)
    return {
        "date": today,
        "rx_bytes": rx_bytes,
        "tx_bytes": tx_bytes,
        "total_bytes": rx_bytes + tx_bytes,
    }