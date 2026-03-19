import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { Coin } from "../../hooks/useQueries";

const COIN_META: Record<
  Coin,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  [Coin.BTC]: {
    label: "BTC/USDT",
    color: "oklch(0.75 0.18 60)",
    bgColor: "oklch(0.75 0.18 60 / 0.15)",
    borderColor: "oklch(0.75 0.18 60 / 0.4)",
  },
  [Coin.ETH]: {
    label: "ETH/USDT",
    color: "oklch(0.83 0.14 200)",
    bgColor: "oklch(0.83 0.14 200 / 0.15)",
    borderColor: "oklch(0.83 0.14 200 / 0.4)",
  },
  [Coin.SOL]: {
    label: "SOL/USDT",
    color: "oklch(0.84 0.21 152)",
    bgColor: "oklch(0.84 0.21 152 / 0.15)",
    borderColor: "oklch(0.84 0.21 152 / 0.4)",
  },
  [Coin.BNB]: {
    label: "BNB/USDT",
    color: "oklch(0.80 0.17 80)",
    bgColor: "oklch(0.80 0.17 80 / 0.15)",
    borderColor: "oklch(0.80 0.17 80 / 0.4)",
  },
};

function buildSparkline(price: number): { v: number }[] {
  let v = price;
  return Array.from({ length: 8 }, () => {
    v = v * (1 + (Math.random() - 0.5) * 0.008);
    return { v };
  });
}

interface Props {
  prices: Record<Coin, number> | undefined;
  prevPrices: Record<Coin, number> | undefined;
  onTrade: (coin: Coin) => void;
}

export default function MarketWatch({ prices, prevPrices, onTrade }: Props) {
  const coins = [Coin.BTC, Coin.ETH, Coin.SOL, Coin.BNB];

  return (
    <div>
      <h2
        className="text-xs font-bold uppercase tracking-widest mb-3"
        style={{ color: "oklch(0.63 0.028 220)" }}
      >
        Live Market Watch
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {coins.map((coin, i) => {
          const price = prices?.[coin] ?? 0;
          const prev = prevPrices?.[coin] ?? price;
          const change =
            prev > 0
              ? ((price - prev) / prev) * 100
              : (Math.random() - 0.48) * 3;
          const isUp = change >= 0;
          const meta = COIN_META[coin];
          const spark = buildSparkline(price);
          const upStroke = "oklch(0.84 0.21 152)";
          const downStroke = "oklch(0.61 0.18 22)";
          const priceStr =
            price > 1000
              ? `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
              : `$${price.toFixed(2)}`;

          return (
            <motion.div
              key={coin}
              data-ocid={`market.card.${i + 1}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="card-terminal rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div
                    className="text-xs font-black uppercase tracking-wide"
                    style={{ color: "oklch(0.94 0.012 220)" }}
                  >
                    {meta.label}
                  </div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: isUp ? upStroke : downStroke }}
                  >
                    {isUp ? "+" : ""}
                    {change.toFixed(2)}%
                  </div>
                </div>
                <div className="h-10 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spark}>
                      <Line
                        type="monotone"
                        dataKey="v"
                        stroke={isUp ? upStroke : downStroke}
                        strokeWidth={1.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div
                className="text-lg font-black mb-3"
                style={{ color: "oklch(0.94 0.012 220)" }}
              >
                {priceStr}
              </div>

              <Button
                data-ocid={`market.trade.button.${i + 1}`}
                size="sm"
                onClick={() => onTrade(coin)}
                className="w-full h-7 text-xs font-bold uppercase tracking-wider"
                style={{
                  background: meta.bgColor,
                  border: `1px solid ${meta.borderColor}`,
                  color: meta.color,
                }}
              >
                Trade
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
