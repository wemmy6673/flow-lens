export default function StatusBadge({ connected }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
      style={{
        borderColor: connected ? "rgba(34, 229, 160, 0.3)" : "rgba(248, 113, 113, 0.3)",
        backgroundColor: connected ? "rgba(34, 229, 160, 0.1)" : "rgba(248, 113, 113, 0.1)",
        color: connected ? "#22e5a0" : "#f87171",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: connected ? "#22e5a0" : "#f87171" }}
      />
      {connected ? "CONNECTED" : "DISCONNECTED"}
    </span>
  );
}