export default function StatusBadge({ connected }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted">
      <span
        className={`h-2 w-2 rounded-full transition-colors ${
          connected ? "bg-ok" : "bg-bad"
        }`}
      />
      {connected ? "Live" : "Disconnected — retrying…"}
    </span>
  );
}