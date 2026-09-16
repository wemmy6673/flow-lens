import { useEffect, useRef, useState } from "react";

const MAX_SAMPLES = 120; // ~2 min at 1s cadence

function defaultWsUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("ws") || `ws://${window.location.hostname || "localhost"}:8000/ws`;
}

export function useThroughputSocket(url = defaultWsUrl()) {
  const [connected, setConnected] = useState(false);
  const [latest, setLatest] = useState({ rx_bps: 0, tx_bps: 0, interface_index: null });
  const [samples, setSamples] = useState([]);
  const reconnectTimer = useRef(null);

  useEffect(() => {
    let ws;
    let cancelled = false;

    function connect() {
      ws = new WebSocket(url);

      ws.onopen = () => {
        if (cancelled) return;
        setConnected(true);
      };

      ws.onclose = () => {
        if (cancelled) return;
        setConnected(false);
        reconnectTimer.current = setTimeout(connect, 2000);
      };

      ws.onerror = () => ws.close();

      ws.onmessage = (event) => {
        if (cancelled) return;
        const msg = JSON.parse(event.data);
        setLatest(msg);
        setSamples((prev) => {
          const next = [...prev, msg];
          return next.length > MAX_SAMPLES ? next.slice(next.length - MAX_SAMPLES) : next;
        });
      };
    }

    connect();

    return () => {
      cancelled = true;
      clearTimeout(reconnectTimer.current);
      ws?.close();
    };
  }, [url]);

  return { connected, latest, samples };
}