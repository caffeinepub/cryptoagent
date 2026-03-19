import { motion } from "motion/react";
import type { PortfolioView } from "../../backend.d";
import { Coin } from "../../hooks/useQueries";

const COIN_ICONS: Record<Coin, string> = {
  [Coin.BTC]: "₿",
  [Coin.ETH]: "Ξ",
  [Coin.SOL]: "◎",
  [Coin.BNB]: "B",
};

const COIN_COLORS: Record<Coin, string> = {
  [Coin.BTC]: "oklch(0.75 0.18 60)",
  [Coin.ETH]: "oklch(0.83 0.14 200)",
  [Coin.SOL]: "oklch(0.84 0.21 152)",
  [Coin.BNB]: "oklch(0.80 0.17 80)",
};

interface Props {
  portfolio: PortfolioView | undefined;
  prices: Record<Coin, number> | undefined;
}

export default function HoldingsTable({ portfolio, prices }: Props) {
  const holdings = portfolio?.holdings ?? [];
  const trades = portfolio?.tradeHistory ?? [];

  // Compute avg buy price per coin
  const avgBuy: Record<string, number> = {};
  for (const coin of [Coin.BTC, Coin.ETH, Coin.SOL, Coin.BNB]) {
    const buys = trades.filter((t) => t.coin === coin && t.direction === "buy");
    const totalQty = buys.reduce((s, t) => s + t.quantity, 0);
    const totalCost = buys.reduce((s, t) => s + t.quantity * t.price, 0);
    avgBuy[coin] = totalQty > 0 ? totalCost / totalQty : 0;
  }

  const rows = holdings.filter(([, qty]) => qty > 0.0001);

  return (
    <motion.div
      data-ocid="holdings.table"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="card-terminal rounded-xl p-5 h-full"
    >
      <h2
        className="text-xs font-bold uppercase tracking-widest mb-4"
        style={{ color: "oklch(0.63 0.028 220)" }}
      >
        Your Holdings Breakdown
      </h2>

      {rows.length === 0 ? (
        <div
          data-ocid="holdings.empty_state"
          className="flex flex-col items-center justify-center py-8"
        >
          <p className="text-sm" style={{ color: "oklch(0.63 0.028 220)" }}>
            No holdings yet
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "oklch(0.40 0.020 230)" }}
          >
            Execute trades to build your portfolio
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {["Asset", "Amount", "Value", "Avg Price", "P&L"].map((h) => (
                  <th
                    key={h}
                    className="text-left pb-2 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "oklch(0.40 0.020 230)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([coin, qty], i) => {
                const price = prices?.[coin] ?? 0;
                const value = qty * price;
                const avg = avgBuy[coin] ?? 0;
                const pl = avg > 0 ? (price - avg) * qty : 0;
                const isPos = pl >= 0;

                return (
                  <tr
                    key={coin}
                    data-ocid={`holdings.row.${i + 1}`}
                    className="border-t"
                    style={{ borderColor: "oklch(0.23 0.036 225 / 0.5)" }}
                  >
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                          style={{
                            background: `${COIN_COLORS[coin].replace(")", " / 0.15)")}`,
                            color: COIN_COLORS[coin],
                          }}
                        >
                          {COIN_ICONS[coin]}
                        </div>
                        <span
                          className="text-xs font-bold"
                          style={{ color: "oklch(0.94 0.012 220)" }}
                        >
                          {coin}
                        </span>
                      </div>
                    </td>
                    <td
                      className="py-2.5 text-xs"
                      style={{ color: "oklch(0.94 0.012 220)" }}
                    >
                      {qty.toFixed(4)}
                    </td>
                    <td
                      className="py-2.5 text-xs font-semibold"
                      style={{ color: "oklch(0.94 0.012 220)" }}
                    >
                      $
                      {value.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td
                      className="py-2.5 text-xs"
                      style={{ color: "oklch(0.63 0.028 220)" }}
                    >
                      {avg > 0 ? `$${avg.toFixed(2)}` : "—"}
                    </td>
                    <td
                      className="py-2.5 text-xs font-bold"
                      style={{
                        color: isPos
                          ? "oklch(0.84 0.21 152)"
                          : "oklch(0.61 0.18 22)",
                      }}
                    >
                      {isPos ? "+" : ""}
                      {pl.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
