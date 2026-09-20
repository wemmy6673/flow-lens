export default function StatusBadge({ connected }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
        connected
          ? "border-down/30 bg-down/10 text-down"
          : "border-bad/30 bg-bad/10 text-bad"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-green-700" : "bg-red-700"}`} />
      {connected ? "CONNECTED" : "DISCONNECTED"}
    </span>
  );
}