import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function ThroughputChart({ samples }) {
  const data = samples.map((s) => ({
    time: new Date(s.ts * 1000).toLocaleTimeString(),
    down: s.rx_bps / 1_000_000,
    up: s.tx_bps / 1_000_000,
  }));

  return (
    <div className="rounded-[10px] border border-graticule bg-panel p-5">
      <p className="mb-2.5 text-sm text-muted">Last 2 minutes</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid stroke="#223049" strokeDasharray="0" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis
              stroke="#7f8ba1"
              tick={{ fill: "#7f8ba1", fontSize: 12 }}
              tickFormatter={(v) => v.toFixed(1)}
              label={{
                value: "Mbps",
                angle: -90,
                position: "insideLeft",
                fill: "#7f8ba1",
                fontSize: 12,
              }}
            />
            <Tooltip
              contentStyle={{
                background: "#1a212c",
                border: "1px solid #26313f",
                borderRadius: 8,
                fontSize: 13,
              }}
              formatter={(value, name) => [`${value.toFixed(2)} Mbps`, name]}
            />
            <Line
              type="monotone"
              dataKey="down"
              name="Download"
              stroke="#4fd1c5"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="up"
              name="Upload"
              stroke="#c586e0"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}