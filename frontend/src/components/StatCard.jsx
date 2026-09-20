const VALUE_COLORS = {
  down: "#22e5a0",
  up: "#f97316",
  neutral: "#e7ebf1",
};

export default function StatCard({ eyebrow, value, unit, color = "neutral", subline }) {
  return (
    <div
      className="rounded-[30px] border px-5 py-10"
      style={{ borderColor: "#1c212b", backgroundColor: "#10141b",  borderTopColor: VALUE_COLORS[color] }}
    >
      <p
        className="mb-1.5 text-[11px] font-medium uppercase tracking-wider"
        style={{ color: "#7d8798", backgroundColor: "#10141b" }}
      >
        {eyebrow}
      </p>
      <p
        className="text-4xl leading-none"
        style={{ color: VALUE_COLORS[color], backgroundColor: "#10141b" }}
      >
        {value}
        {unit && (
          <span className="ml-1.5 font-sans text-sm" style={{ color: "#7d8798" }}>
            {unit}
          </span>
        )}
      </p>
      {subline && (
        <p className="mt-1.5 text-xs" style={{ color: "#7d8798" }}>
          {subline}
        </p>
      )}
    </div>
  );
}