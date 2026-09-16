import { useEffect, useState } from "react";

const POLL_MS = 30_000; // usage doesn't need per-second refresh

function defaultApiBase() {
  const params = new URLSearchParams(window.location.search);
  return params.get("api") || `http://${window.location.hostname || "localhost"}:8000`;
}

export function useDailyUsage(apiBase = defaultApiBase()) {
  const [usage, setUsage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchUsage() {
      try {
        const res = await fetch(`${apiBase}/usage/today`);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setUsage(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }

    fetchUsage();
    const interval = setInterval(fetchUsage, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [apiBase]);

  return { usage, error };
}