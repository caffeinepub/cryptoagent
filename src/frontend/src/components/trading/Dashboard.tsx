import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  type Coin,
  useLivePrices,
  usePortfolioStats,
  useResetPortfolio,
  useToggleAgent,
} from "../../hooks/useQueries";
import AgentPanel from "./AgentPanel";
import HoldingsTable from "./HoldingsTable";
import KpiCards from "./KpiCards";
import MarketWatch from "./MarketWatch";
import Navbar from "./Navbar";
import PortfolioChart from "./PortfolioChart";
import Sidebar from "./Sidebar";
import TradeHistory from "./TradeHistory";
import TradeModal from "./TradeModal";

function useUtcClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(`${new Date().toUTCString().slice(17, 25)} UTC`);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Dashboard() {
  const utcTime = useUtcClock();
  const { data: prices } = useLivePrices();
  const { data: portfolio } = usePortfolioStats();
  const { mutate: toggleAgent, isPending: isTogglingAgent } = useToggleAgent();
  const { mutate: resetPortfolio } = useResetPortfolio();

  const [tradeCoin, setTradeCoin] = useState<Coin | null>(null);
  const prevPricesRef = useRef<typeof prices>(undefined);

  useEffect(() => {
    if (prices) prevPricesRef.current = prices;
  }, [prices]);

  const cash = portfolio?.cashBalance ?? 10000;
  const holdingsValue = (portfolio?.holdings ?? []).reduce(
    (sum, [coin, qty]) => {
      return sum + qty * (prices?.[coin] ?? 0);
    },
    0,
  );
  const totalBalance = cash + holdingsValue;
  const currentYear = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />

      <main className="ml-14 pt-14 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1
                className="text-2xl font-black uppercase tracking-widest"
                style={{ color: "oklch(0.94 0.012 220)" }}
              >
                Dashboard Overview
              </h1>
              <p
                className="text-xs mt-0.5"
                style={{ color: "oklch(0.63 0.028 220)" }}
              >
                Paper Trading Simulator
              </p>
            </div>
            <div className="text-right">
              <div
                className="text-xs font-mono"
                style={{ color: "oklch(0.63 0.028 220)" }}
              >
                {utcTime}
              </div>
              <div
                className="text-xs font-semibold mt-0.5 flex items-center gap-1.5 justify-end"
                style={{ color: "oklch(0.84 0.21 152)" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block animate-pulse-glow"
                  style={{ background: "oklch(0.84 0.21 152)" }}
                />
                Live
              </div>
            </div>
          </motion.div>

          <KpiCards
            portfolio={portfolio}
            prices={prices}
            onToggleAgent={toggleAgent}
            isTogglingAgent={isTogglingAgent}
          />

          <PortfolioChart
            trades={portfolio?.tradeHistory ?? []}
            currentBalance={totalBalance}
          />

          <MarketWatch
            prices={prices}
            prevPrices={prevPricesRef.current}
            onTrade={setTradeCoin}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AgentPanel portfolio={portfolio} />
            <HoldingsTable portfolio={portfolio} prices={prices} />
          </div>

          <TradeHistory trades={portfolio?.tradeHistory ?? []} />

          <footer
            className="pt-4 border-t flex flex-wrap items-center justify-between gap-3"
            style={{ borderColor: "oklch(0.23 0.036 225)" }}
          >
            <span
              className="text-xs"
              style={{ color: "oklch(0.40 0.020 230)" }}
            >
              CryptoAgent © {currentYear}
            </span>
            <div
              className="flex items-center gap-4 text-xs"
              style={{ color: "oklch(0.40 0.020 230)" }}
            >
              <span>About</span>
              <span>Support</span>
              <span>Terms</span>
              <span>Privacy</span>
              <button
                type="button"
                data-ocid="settings.reset.button"
                onClick={() => {
                  if (
                    window.confirm(
                      "Reset portfolio to $10,000? This cannot be undone.",
                    )
                  ) {
                    resetPortfolio();
                  }
                }}
                className="text-red-400/60 hover:text-red-400 transition-colors"
              >
                Reset Portfolio
              </button>
            </div>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs"
              style={{ color: "oklch(0.40 0.020 230)" }}
            >
              Built with ♥ using caffeine.ai
            </a>
          </footer>
        </div>
      </main>

      <TradeModal
        coin={tradeCoin}
        price={tradeCoin ? (prices?.[tradeCoin] ?? 0) : 0}
        onClose={() => setTradeCoin(null)}
      />
    </div>
  );
}
