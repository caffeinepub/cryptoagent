import { Button } from "@/components/ui/button";
import { Lock, Shield, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

const FEATURES = [
  { icon: TrendingUp, label: "Live Prices" },
  { icon: Zap, label: "AI Agent" },
  { icon: Shield, label: "Secure" },
  { icon: Lock, label: "Decentralized" },
];

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.83 0.14 200 / 0.15) 1px, transparent 1px), linear-gradient(90deg, oklch(0.83 0.14 200 / 0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "oklch(0.84 0.21 152)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{ background: "oklch(0.83 0.14 200)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 glow-green"
            style={{
              background: "oklch(0.16 0.032 230)",
              border: "1px solid oklch(0.84 0.21 152 / 0.4)",
            }}
          >
            <span
              className="text-2xl font-black"
              style={{ color: "oklch(0.84 0.21 152)" }}
            >
              A
            </span>
          </div>
          <h1
            className="text-3xl font-black tracking-widest uppercase"
            style={{ color: "oklch(0.94 0.012 220)" }}
          >
            CryptoAgent
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "oklch(0.63 0.028 220)" }}
          >
            AI-Powered Paper Trading Terminal
          </p>
        </div>

        <div className="card-terminal rounded-xl p-8">
          <h2
            className="text-lg font-bold uppercase tracking-wider mb-2"
            style={{ color: "oklch(0.94 0.012 220)" }}
          >
            Access Terminal
          </h2>
          <p
            className="text-sm mb-6"
            style={{ color: "oklch(0.63 0.028 220)" }}
          >
            Sign in with Internet Identity to access your trading dashboard and
            portfolio.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 p-3 rounded-lg"
                style={{
                  background: "oklch(0.20 0.030 230)",
                  border: "1px solid oklch(0.23 0.036 225)",
                }}
              >
                <Icon
                  className="w-4 h-4"
                  style={{ color: "oklch(0.83 0.14 200)" }}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: "oklch(0.63 0.028 220)" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          <Button
            data-ocid="login.primary_button"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full font-bold uppercase tracking-wider glow-green"
            style={{
              background: "oklch(0.84 0.21 152)",
              color: "oklch(0.10 0.02 243)",
              border: "none",
            }}
          >
            {isLoggingIn ? "Connecting..." : "Connect Wallet"}
          </Button>
        </div>

        <p
          className="text-center text-xs mt-6"
          style={{ color: "oklch(0.40 0.020 230)" }}
        >
          Virtual trading only — no real funds involved
        </p>
      </motion.div>
    </div>
  );
}
