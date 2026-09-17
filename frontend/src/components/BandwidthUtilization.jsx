// Link capacity used to compute utilization %. Adjust to your actual plan.
const DOWN_CAPACITY_MBPS = 1000;
const UP_CAPACITY_MBPS = 100;

function UtilizationRow({ label, mbps, capacityMbps, colorClass }) {
  const pct = capacityMbps > 0 ? Math.min(100, (mbps / capacityMbps) * 100) : 0;
  const capacityLabel =
    capacityMbps >= 1000 ? `${(capacityMbps / 1000).toFixed(2)} Gbps` : `${capacityMbps.toFixed(1)} Mbps`;

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <p className="text-xs text-muted">{label}</p>
        <p className="text-xs text-muted">
          {pct.toFixed(1)}% of {capacityLabel}
        </p>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-graticule">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function BandwidthUtilization({ downMbps, upMbps }) {
  return (
    <div className="rounded-xl border border-graticule bg-panel p-5">
      <p className="mb-4 text-sm font-medium text-ink_text">Bandwidth Utilization</p>
      <div className="flex flex-col gap-4">
        <UtilizationRow
          label="Download"
          mbps={downMbps}
          capacityMbps={DOWN_CAPACITY_MBPS}
          colorClass="bg-down"
        />
        <UtilizationRow
          label="Upload"
          mbps={upMbps}
          capacityMbps={UP_CAPACITY_MBPS}
          colorClass="bg-up"
        />
      </div>
    </div>
  );
}

export default BandwidthUtilization;