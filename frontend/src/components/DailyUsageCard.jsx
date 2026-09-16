function bytesToGB(bytes) {
  return bytes / 1_000_000_000;
}

export default function DailyUsageCard({ usage }) {
  if (!usage) {
    return (
      <div className="rounded-[10px] border border-graticule bg-panel p-5">
        <p className="text-sm text-muted">Today</p>
        <p className="mt-2 text-sm text-muted">Loading…</p>
      </div>
    );
  }

  const downGB = bytesToGB(usage.rx_bytes);
  const upGB = bytesToGB(usage.tx_bytes);
  const total = downGB + upGB;
  const downPct = total > 0 ? (downGB / total) * 100 : 50;
  const upPct = 100 - downPct;

  return (
    <div className="rounded-[10px] border border-graticule bg-panel p-5">
      <p className="mb-2 text-sm text-muted">Today</p>
      <p className="mb-3 font-mono text-base">
        <span className="text-down">{downGB.toFixed(2)} GB</span> down,{" "}
        <span className="text-up">{upGB.toFixed(2)} GB</span> up
      </p>
      <div className="flex h-1.5 overflow-hidden rounded-full">
        <div className="bg-down" style={{ width: `${downPct}%` }} />
        <div className="bg-up" style={{ width: `${upPct}%` }} />
      </div>
    </div>
  );
}