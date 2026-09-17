import { useEffect, useState } from "react";
import { useThroughputSocket } from "./hooks/useThroughputSocket.js";
import { useDailyUsage } from "./hooks/useDailyUsage.js";
import { useHealth } from "./hooks/useHealth.js";
import { formatUptime } from "./utils/format.js";
import StatusBadge from "./components/StatusBadge.jsx";
import StatCard from "./components/StatCard.jsx";
import ThroughputChart from "./components/ThroughputChart.jsx";
import BandwidthUtilization from "./components/BandwidthUtilization.jsx";

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function App() {
  const { connected, latest, samples } = useThroughputSocket();
  const { usage } = useDailyUsage();
  const health = useHealth();
  const clock = useClock();

  const downMbps = latest.rx_bps / 1_000_000;
  const upMbps = latest.tx_bps / 1_000_000;
  const downGB = usage ? usage.rx_bytes / 1_000_000_000 : null;
  const upGB = usage ? usage.tx_bytes / 1_000_000_000 : null;

  return (
    <div className="mx-auto flex min-h-screen bg-gray-900 text-white md:mx-20 flex-col gap-6 px-4 py-6 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Swap this square for an <img src={logo} /> once you have the logo file */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-down text-sm font-bold text-ink">
            RT
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-ink_text">RouterTrace</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted">
          {health && (
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-down" />
              {health.snmp_host}
            </span>
          )}
          <span>{clock.toLocaleTimeString()}</span>
          <StatusBadge connected={connected} />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          eyebrow="Download"
          value={downMbps.toFixed(1)}
          unit="Mbps"
          color="down"
          subline={downGB != null ? `↓ ${downGB.toFixed(2)} GB total` : undefined}
        />
        <StatCard
          eyebrow="Upload"
          value={upMbps.toFixed(1)}
          unit="Mbps"
          color="up"
          subline={upGB != null ? `↑ ${upGB.toFixed(2)} GB total` : undefined}
        />
        <StatCard
          eyebrow="Uptime"
          value={formatUptime(latest.uptime_seconds)}
          color="neutral"
        />
      </div>

      <ThroughputChart samples={samples} />

      <BandwidthUtilization downMbps={downMbps} upMbps={upMbps} />
    </div>
  );
}