// Link capacity used to compute utilization %. Adjust to your actual plan.
const DOWN_CAPACITY_MBPS = 1000;
const UP_CAPACITY_MBPS = 100;

function UtilizationRow({ label, mbps, capacityMbps, barColor }) {
  const pct = capacityMbps > 0 ? Math.min(100, (mbps / capacityMbps) * 100) : 0;
  const capacityLabel =
    capacityMbps >= 1000 ? `${(capacityMbps / 1000).toFixed(2)} Gbps` : `${capacityMbps.toFixed(1)} Mbps`;

  return (
    <div className="bg-[#10141b]">
      <div className="mb-1.5 flex items-baseline justify-between bg-[#10141b]">
        <p className="text-xs" style={{ color: "#7d8798" }}>{label}</p>
        <p className="text-xs" style={{ color: "#7d8798" }}>
          {pct.toFixed(1)}% of {capacityLabel}
        </p>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: "#1c212b" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}

export default function BandwidthUtilization({ downMbps, upMbps }) {
  return (
    <div
      className="rounded-[30px] border p-5"
      style={{ borderColor: "#1c212b", backgroundColor: "#10141b" }}
    >
      <p className="mb-4 text-sm font-medium bg-transparent" style={{ color: "#e7ebf1" }}>
        Bandwidth Utilization
      </p>
      <div className="flex flex-col gap-4 bg-[#10141b]">
        <UtilizationRow
          label="Download"
          mbps={downMbps}
          capacityMbps={DOWN_CAPACITY_MBPS}
          barColor="#22e5a0"
        />
        <UtilizationRow
          label="Upload"
          mbps={upMbps}
          capacityMbps={UP_CAPACITY_MBPS}
          barColor="#f97316"
        />
      </div>
    </div>
  );
}