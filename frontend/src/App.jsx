import { useThroughputSocket } from "./hooks/useThroughputSocket.js";
import { useDailyUsage } from "./hooks/useDailyUsage.js";
import StatusBadge from "./components/StatusBadge.jsx";
import ThroughputCard from "./components/ThroughputCard.jsx";
import ThroughputChart from "./components/ThroughputChart.jsx";
import DailyUsageCard from "./components/DailyUsageCard.jsx";

export default function App() {
  const { connected, latest, samples } = useThroughputSocket();
  const { usage } = useDailyUsage();

  const downMbps = latest.rx_bps / 1_000_000;
  const upMbps = latest.tx_bps / 1_000_000;

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-8 sm:px-8">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-lg font-medium leading-tight">Link monitor</h1>
          <p className="text-sm text-muted">
            Interface {latest.interface_index ?? "—"}
          </p>
        </div>
        <StatusBadge connected={connected} />
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ThroughputCard direction="down" mbps={downMbps} />
        <ThroughputCard direction="up" mbps={upMbps} />
      </div>

      <ThroughputChart samples={samples} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DailyUsageCard usage={usage} />
        <div className="rounded-[10px] border border-graticule bg-panel p-5">
          <p className="mb-2 text-sm text-muted">Session</p>
          <p className="text-sm leading-relaxed text-ink_text">
            Polling every second over SNMP. Daily usage resets at local midnight.
          </p>
        </div>
      </div>
    </div>
  );
}