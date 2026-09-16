const DIRECTION_STYLES = {
  down: { label: "Download", color: "text-down" },
  up: { label: "Upload", color: "text-up" },
};

export default function ThroughputCard({ direction, mbps }) {
  const { label, color } = DIRECTION_STYLES[direction];
  return (
    <div className="rounded-[10px] border border-graticule bg-panel p-5">
      <p className="mb-1.5 text-sm text-muted">{label}</p>
      <p className={`font-mono text-3xl ${color}`}>
        {mbps.toFixed(2)}
        <span className="ml-1.5 font-sans text-base text-muted">Mbps</span>
      </p>
    </div>
  );
}