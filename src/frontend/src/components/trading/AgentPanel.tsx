import { Activity, Bot, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { PortfolioView, Trade } from "../../backend.d";

interface Props {
  portfolio: PortfolioView | undefined;
}

function getRecentAction(trades: Trade[]): string {
  if (trades.length === 0) return "No trades yet";
  const last = [...trades].sort((a, b) => Number(b.timestamp - a.timestamp))[0];
  return `${last.direction.toUpperCase()} ${last.quantity.toFixed(4)} ${last.coin} @ $${last.price.toFixed(2)}`;
}

export default function AgentPanel({ portfolio }: Props) {
  const agentOn = portfolio?.automatedTradingEnabled ?? false;
  const trades = portfolio?.tradeHistory ?? [];
  const activeTrades =
    portfolio?.holdings?.filter(([, qty]) => qty > 0).length ?? 0;

  const statusBg = agentOn
    ? "linear-gradient(135deg, oklch(0.84 0.21 152 / 0.15), oklch(0.83 0.14 200 / 0.1))"
    : "oklch(0.20 0.030 230)";
  const statusBorder = agentOn
    ? "oklch(0.84 0.21 152 / 0.4)"
    : "oklch(0.23 0.036 225)";
  const statusColor = agentOn
    ? "oklch(0.84 0.21 152)"
    : "oklch(0.63 0.028 220)";
  const statusGlow = agentOn ? "0 0 16px oklch(0.84 0.21 152 / 0.15)" : "none";
  const dotGlow = agentOn ? "0 0 6px oklch(0.84 0.21 152)" : "none";
  const dotBg = agentOn ? "oklch(0.84 0.21 152)" : "oklch(0.40 0.020 230)";

  return (
    <motion.div
      data-ocid="agent.panel"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="card-terminal rounded-xl p-5 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "oklch(0.63 0.028 220)" }}
        >
          AI Agent Control Panel
        </h2>
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: dotBg, boxShadow: dotGlow }}
        />
      </div>

      <div className="space-y-3 mb-5">
        {(
          [
            { icon: Bot, label: "Agent", value: "CryptoAgent v2.1" },
            {
              icon: TrendingUp,
              label: "Strategy",
              value: agentOn ? "Moving Average Crossover" : "Standby",
            },
            {
              icon: Activity,
              label: "Active Trades",
              value: `${activeTrades} positions open`,
            },
            {
              icon: Zap,
              label: "Recent Action",
              value: getRecentAction(trades),
            },
          ] as const
        ).map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{ background: "oklch(0.20 0.030 230)" }}
          >
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: "oklch(0.13 0.025 235)" }}
            >
              <Icon
                className="w-3 h-3"
                style={{ color: "oklch(0.83 0.14 200)" }}
              />
            </div>
            <div>
              <div
                className="text-xs"
                style={{ color: "oklch(0.63 0.028 220)" }}
              >
                {label}
              </div>
              <div
                className="text-xs font-semibold truncate"
                style={{ color: "oklch(0.94 0.012 220)" }}
              >
                {value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        data-ocid="agent.status.button"
        className="w-full py-3 rounded-xl text-center text-sm font-black uppercase tracking-widest"
        style={{
          background: statusBg,
          border: `1px solid ${statusBorder}`,
          color: statusColor,
          boxShadow: statusGlow,
        }}
      >
        {agentOn ? "● Agent is Monitoring" : "○ Agent is Offline"}
      </div>
    </motion.div>
  );
}
