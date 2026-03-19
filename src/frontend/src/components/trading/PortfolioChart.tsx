import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Trade } from "../../backend.d";

interface Props {
  trades: Trade[];
  currentBalance: number;
}

interface ChartPoint {
  date: string;
  value: number;
}

function buildChartData(trades: Trade[], currentBalance: number): ChartPoint[] {
  const now = Date.now();
  const days = 30;
  const msPerDay = 86_400_000;

  const dailyPl: Record<string, number> = {};
  for (const t of trades) {
    const ms = Number(t.timestamp / 1_000_000n);
    const d = new Date(ms);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    dailyPl[key] = (dailyPl[key] ?? 0) + t.profitLoss;
  }

  const data: ChartPoint[] = [];
  let cumulative = 10000;
  for (let i = days; i >= 0; i--) {
    const ts = now - i * msPerDay;
    const d = new Date(ts);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const pl =
      dailyPl[key] ??
      (i < 5 ? (Math.random() - 0.45) * 200 : (Math.random() - 0.48) * 150);
    cumulative += pl;
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.max(cumulative, 1000),
    });
  }
  if (data.length > 0) {
    (data[data.length - 1] as ChartPoint).value = currentBalance;
  }
  return data;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  return (
    <div className="card-terminal rounded-lg px-3 py-2 text-xs">
      <div style={{ color: "oklch(0.63 0.028 220)" }}>{label}</div>
      <div className="font-bold" style={{ color: "oklch(0.83 0.14 200)" }}>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(val)}
      </div>
    </div>
  );
};

export default function PortfolioChart({ trades, currentBalance }: Props) {
  const data = useMemo(
    () => buildChartData(trades, currentBalance),
    [trades, currentBalance],
  );
  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = Math.min(...data.map((d) => d.value));
  const growth = currentBalance - 10000;
  const growthBg =
    growth >= 0 ? "oklch(0.84 0.21 152 / 0.1)" : "oklch(0.61 0.18 22 / 0.1)";
  const growthBorder =
    growth >= 0 ? "oklch(0.84 0.21 152 / 0.3)" : "oklch(0.61 0.18 22 / 0.3)";
  const growthColor =
    growth >= 0 ? "oklch(0.84 0.21 152)" : "oklch(0.61 0.18 22)";
  const growthFmt = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
  }).format(growth);

  return (
    <div data-ocid="chart.panel" className="card-terminal rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "oklch(0.63 0.028 220)" }}
          >
            Portfolio Performance
          </h2>
          <p
            className="text-lg font-black mt-0.5"
            style={{ color: "oklch(0.94 0.012 220)" }}
          >
            30-Day Overview
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-xs font-bold"
          style={{
            background: growthBg,
            border: `1px solid ${growthBorder}`,
            color: growthColor,
          }}
        >
          {growth >= 0 ? "+" : ""}
          {growthFmt} growth
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 4, right: 8, bottom: 4, left: 0 }}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop
                  offset="0%"
                  stopColor="oklch(0.83 0.14 200)"
                  stopOpacity={0.6}
                />
                <stop
                  offset="100%"
                  stopColor="oklch(0.84 0.21 152)"
                  stopOpacity={1}
                />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.23 0.036 225 / 0.5)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "oklch(0.40 0.020 230)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis
              domain={[minVal * 0.98, maxVal * 1.02]}
              tick={{ fill: "oklch(0.40 0.020 230)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={10000}
              stroke="oklch(0.40 0.020 230)"
              strokeDasharray="4 4"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#lineGradient)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                fill: "oklch(0.83 0.14 200)",
                filter: "url(#glow)",
              }}
              filter="url(#glow)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
