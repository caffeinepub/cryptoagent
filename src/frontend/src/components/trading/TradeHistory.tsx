import { motion } from "motion/react";
import type { Trade } from "../../backend.d";

interface Props {
  trades: Trade[];
}

function fmtTs(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TradeHistory({ trades }: Props) {
  const sorted = [...trades]
    .sort((a, b) => Number(b.timestamp - a.timestamp))
    .slice(0, 20);

  return (
    <motion.div
      data-ocid="trade_history.table"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card-terminal rounded-xl p-5"
    >
      <h2
        className="text-xs font-bold uppercase tracking-widest mb-4"
        style={{ color: "oklch(0.63 0.028 220)" }}
      >
        Recent Trade History
      </h2>

      {sorted.length === 0 ? (
        <div data-ocid="trade_history.empty_state" className="py-8 text-center">
          <p className="text-sm" style={{ color: "oklch(0.63 0.028 220)" }}>
            No trades yet
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "oklch(0.40 0.020 230)" }}
          >
            Your trade history will appear here
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {["Time", "Type", "Pair", "Price", "Amount", "P&L"].map((h) => (
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
              {sorted.map((trade, i) => {
                const isBuy = trade.direction === "buy";
                const isPos = trade.profitLoss >= 0;
                const rowKey = `${String(trade.timestamp)}-${trade.coin}-${i}`;
                return (
                  <tr
                    key={rowKey}
                    data-ocid={`trade_history.row.${i + 1}`}
                    className="border-t transition-colors hover:bg-white/[0.02]"
                    style={{ borderColor: "oklch(0.23 0.036 225 / 0.5)" }}
                  >
                    <td
                      className="py-2.5 text-xs"
                      style={{ color: "oklch(0.63 0.028 220)" }}
                    >
                      {fmtTs(trade.timestamp)}
                    </td>
                    <td className="py-2.5">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-bold uppercase"
                        style={{
                          background: isBuy
                            ? "oklch(0.84 0.21 152 / 0.15)"
                            : "oklch(0.61 0.18 22 / 0.15)",
                          color: isBuy
                            ? "oklch(0.84 0.21 152)"
                            : "oklch(0.61 0.18 22)",
                        }}
                      >
                        {trade.direction}
                      </span>
                    </td>
                    <td
                      className="py-2.5 text-xs font-semibold"
                      style={{ color: "oklch(0.94 0.012 220)" }}
                    >
                      {trade.coin}/USDT
                    </td>
                    <td
                      className="py-2.5 text-xs"
                      style={{ color: "oklch(0.94 0.012 220)" }}
                    >
                      $
                      {trade.price.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td
                      className="py-2.5 text-xs"
                      style={{ color: "oklch(0.63 0.028 220)" }}
                    >
                      {trade.quantity.toFixed(4)}
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
                      {trade.profitLoss.toFixed(2)}
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
