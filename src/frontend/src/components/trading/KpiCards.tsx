import { Switch } from "@/components/ui/switch";
import {
  BarChart2,
  Bot,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import type { PortfolioView } from "../../backend.d";
import type { Coin } from "../../hooks/useQueries";

interface Props {
  portfolio: PortfolioView | undefined;
  prices: Record<Coin, number> | undefined;
  onToggleAgent: () => void;
  isTogglingAgent: boolean;
}

function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function KpiCards({
  portfolio,
  prices,
  onToggleAgent,
  isTogglingAgent,
}: Props) {
  const cash = portfolio?.cashBalance ?? 10000;
  const holdings = portfolio?.holdings ?? [];
  const trades = portfolio?.tradeHistory ?? [];
  const agentOn = portfolio?.automatedTradingEnabled ?? false;

  const holdingsValue = holdings.reduce((sum, [coin, qty]) => {
    const price = prices?.[coin] ?? 0;
    return sum + qty * price;
  }, 0);
  const totalBalance = cash + holdingsValue;

  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const todayPl = trades
    .filter((t) => Number(t.timestamp / 1_000_000n) >= startOfDay)
    .reduce((sum, t) => sum + t.profitLoss, 0);
  const totalPl = trades.reduce((sum, t) => sum + t.profitLoss, 0);
  const wins = trades.filter((t) => t.profitLoss > 0).length;
  const winRate =
    trades.length > 0 ? Math.round((wins / trades.length) * 100) : 0;

  const cards = [
    {
      id: "balance",
      label: "Total Balance",
      value: fmt(totalBalance),
      delta: totalBalance - 10000,
      icon: Wallet,
      iconColor: "oklch(0.83 0.14 200)",
    },
    {
      id: "agent",
      label: "Active AI Agent",
      value: agentOn ? "ON" : "OFF",
      icon: Bot,
      isToggle: true,
      iconColor: agentOn ? "oklch(0.84 0.21 152)" : "oklch(0.63 0.028 220)",
    },
    {
      id: "today_pl",
      label: "Today's P&L",
      value: fmt(todayPl),
      delta: todayPl,
      icon: todayPl >= 0 ? TrendingUp : TrendingDown,
      iconColor: todayPl >= 0 ? "oklch(0.84 0.21 152)" : "oklch(0.61 0.18 22)",
    },
    {
      id: "total_pl",
      label: "Total P&L",
      value: fmt(totalPl),
      delta: totalPl,
      icon: totalPl >= 0 ? TrendingUp : TrendingDown,
      iconColor: totalPl >= 0 ? "oklch(0.84 0.21 152)" : "oklch(0.61 0.18 22)",
    },
    {
      id: "win_rate",
      label: "Win Rate",
      value: `${winRate}%`,
      sub: `${wins}/${trades.length} trades`,
      icon: Target,
      iconColor: "oklch(0.75 0.18 60)",
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {cards.map(({ id, label, value, icon: Icon, iconColor }, i) => {
        const card = cards[i] as any;
        return (
          <motion.div
            key={id}
            data-ocid={`kpi.card.${i + 1}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card-terminal rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "oklch(0.63 0.028 220)" }}
              >
                {label}
              </span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "oklch(0.20 0.030 230)" }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: iconColor }} />
              </div>
            </div>

            {card.isToggle ? (
              <div className="flex items-center gap-2">
                <span
                  className="text-2xl font-black tracking-tight"
                  style={{
                    color: agentOn
                      ? "oklch(0.84 0.21 152)"
                      : "oklch(0.63 0.028 220)",
                  }}
                >
                  {value}
                </span>
                <Switch
                  data-ocid="agent.toggle"
                  checked={agentOn}
                  onCheckedChange={onToggleAgent}
                  disabled={isTogglingAgent}
                  className="ml-auto"
                />
              </div>
            ) : (
              <>
                <div
                  className="text-2xl font-black tracking-tight"
                  style={{ color: "oklch(0.94 0.012 220)" }}
                >
                  {value}
                </div>
                {card.delta !== undefined && (
                  <div
                    className="text-xs font-semibold mt-1"
                    style={{
                      color:
                        card.delta >= 0
                          ? "oklch(0.84 0.21 152)"
                          : "oklch(0.61 0.18 22)",
                    }}
                  >
                    {card.delta >= 0 ? "+" : ""}
                    {fmt(card.delta)}
                  </div>
                )}
                {card.sub && (
                  <div
                    className="text-xs mt-1"
                    style={{ color: "oklch(0.63 0.028 220)" }}
                  >
                    {card.sub}
                  </div>
                )}
              </>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
