import { useEffect, useState } from "react";

function defaultApiBase() {
  const params = new URLSearchParams(window.location.search);
  return params.get("api") || `http://${window.location.hostname || "localhost"}:8000`;
}

// One-time fetch of static backend config (router host, interface index).
// This doesn't change at runtime, so no polling needed.
export function useHealth(apiBase = defaultApiBase()) {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${apiBase}/health`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setHealth(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [apiBase]);

  return health;
}