const COLOR_CLASSES = {
  down: "text-down",
  up: "text-up",
  neutral: "text-ink_text",
};

export default function StatCard({ eyebrow, value, unit, color = "neutral", subline }) {
  return (
    <div className="rounded-[10px] border border-graticule bg-panel px-5 py-4">
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted">
        {eyebrow}
      </p>
      <p className={`font-mono text-2xl leading-none ${COLOR_CLASSES[color]}`}>
        {value}
        {unit && <span className="ml-1.5 font-sans text-sm text-muted">{unit}</span>}
      </p>
      {subline && <p className="mt-1.5 text-xs text-muted">{subline}</p>}
    </div>
  );
}