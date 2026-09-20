import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function formatMbpsAxis(v) {
  return v >= 1000 ? `${(v / 1000).toFixed(0)}G` : `${v}M`;
}

export default function ThroughputChart({ samples }) {
  const data = samples.map((s) => ({
    time: new Date(s.ts * 1000).toLocaleTimeString(),
    down: s.rx_bps / 1_000_000,
    up: s.tx_bps / 1_000_000,
  }));

  return (
    <div
      className="rounded-[30px] border p-5"
      style={{ borderColor: "#1c212b", backgroundColor: "#10141b" }}
    >
      <div className="mb-4 flex flex-wrap  bg-transparent items-start justify-between gap-2">
        <div className="">
          <p className="text-sm font-medium bg-[#10141b]" style={{ color: "#e7ebf1" }}>
            Live Throughput
          </p>
          <p className="text-xs bg-[#10141b] py-1" style={{ color: "#7d8798" }}>
            60-second rolling window &middot; 1s intervals
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs" style={{ color: "#7d8798" }}>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#22e5a0" }} /> Download
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#f97316" }} /> Upload
          </span>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%" className="bg-[10141b]">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="downFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22e5a0" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#22e5a0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="upFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1c212b" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: "#7d8798", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#1c212b" }}
              minTickGap={60}
            />
            <YAxis
              tick={{ fill: "#7d8798", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={40}
              tickFormatter={formatMbpsAxis}
            />
            <Tooltip
              contentStyle={{
                background: "#10141b",
                border: "1px solid #1c212b",
                borderRadius: 8,
                fontSize: 13,
              }}
              labelStyle={{ color: "#7d8798" }}
              formatter={(value, name) => [`${value.toFixed(1)} Mbps`, name]}
            />
            <Area
              type="monotone"
              dataKey="down"
              name="Download"
              stroke="#22e5a0"
              strokeWidth={2}
              fill="url(#downFill)"
              dot={false}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="up"
              name="Upload"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#upFill)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}