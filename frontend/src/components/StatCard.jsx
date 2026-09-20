const COLOR_CLASSES = {
  down: "text-green-600",
  up: "text-orange-600",
  neutral: "text-violet-600",
};

export default function StatCard({ eyebrow, value, unit, color = "neutral", subline }) {
  return (
    <div className="rounded-[20px] border border-gray-800 bg-gray-900 px-5 py-8">
      <p className="mb-1.5 text-[11px] font-medium uppercase bg-gray-900 tracking-wider text-muted">
        {eyebrow}
      </p>
      <p className={`font-bold text-3xl bg-gray-900 leading-none ${COLOR_CLASSES[color]}`}>
        {value}
        {unit && <span className="ml-1.5 font-sans text-sm text-muted">{unit}</span>}
      </p>
      {subline && <p className="mt-1.5 text-xs text-muted">{subline}</p>}
    </div>
  );
}