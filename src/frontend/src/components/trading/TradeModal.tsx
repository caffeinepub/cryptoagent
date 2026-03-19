import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Coin, Direction, useTrade } from "../../hooks/useQueries";

const COIN_META: Record<
  Coin,
  { label: string; color: string; step: string; min: string }
> = {
  [Coin.BTC]: {
    label: "Bitcoin (BTC)",
    color: "oklch(0.75 0.18 60)",
    step: "0.0001",
    min: "0.0001",
  },
  [Coin.ETH]: {
    label: "Ethereum (ETH)",
    color: "oklch(0.83 0.14 200)",
    step: "0.001",
    min: "0.001",
  },
  [Coin.SOL]: {
    label: "Solana (SOL)",
    color: "oklch(0.84 0.21 152)",
    step: "0.01",
    min: "0.01",
  },
  [Coin.BNB]: {
    label: "BNB (BNB)",
    color: "oklch(0.80 0.17 80)",
    step: "0.01",
    min: "0.01",
  },
};

interface Props {
  coin: Coin | null;
  price: number;
  onClose: () => void;
}

export default function TradeModal({ coin, price, onClose }: Props) {
  const [qty, setQty] = useState("");
  const [dir, setDir] = useState<Direction>(Direction.buy);
  const { mutate: executeTrade, isPending } = useTrade();

  const meta = coin ? COIN_META[coin] : null;
  const total = Number.parseFloat(qty || "0") * price;
  const isBuyDir = dir === Direction.buy;
  const buyBg = isBuyDir
    ? "oklch(0.84 0.21 152 / 0.2)"
    : "oklch(0.20 0.030 230)";
  const buyBorder = isBuyDir
    ? "oklch(0.84 0.21 152 / 0.5)"
    : "oklch(0.23 0.036 225)";
  const buyColor = isBuyDir ? "oklch(0.84 0.21 152)" : "oklch(0.63 0.028 220)";
  const sellBg = !isBuyDir
    ? "oklch(0.61 0.18 22 / 0.2)"
    : "oklch(0.20 0.030 230)";
  const sellBorder = !isBuyDir
    ? "oklch(0.61 0.18 22 / 0.5)"
    : "oklch(0.23 0.036 225)";
  const sellColor = !isBuyDir ? "oklch(0.61 0.18 22)" : "oklch(0.63 0.028 220)";
  const submitBg = isBuyDir ? "oklch(0.84 0.21 152)" : "oklch(0.61 0.18 22)";
  const isDisabled = isPending || !qty || Number.parseFloat(qty) <= 0;

  function handleSubmit() {
    if (!coin || !qty || Number.parseFloat(qty) <= 0) return;
    executeTrade(
      { coin, direction: dir, quantity: Number.parseFloat(qty) },
      { onSuccess: onClose },
    );
  }

  return (
    <Dialog open={!!coin} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        data-ocid="trade.modal"
        style={{
          background: "oklch(0.16 0.032 230)",
          border: "1px solid oklch(0.23 0.036 225)",
          color: "oklch(0.94 0.012 220)",
        }}
        className="sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle
            className="text-sm font-black uppercase tracking-wider"
            style={{ color: "oklch(0.94 0.012 220)" }}
          >
            Trade {coin ? `${coin}/USDT` : ""}
          </DialogTitle>
        </DialogHeader>

        {coin && meta && (
          <div className="space-y-4 py-2">
            <div
              className="p-3 rounded-lg text-center"
              style={{ background: "oklch(0.20 0.030 230)" }}
            >
              <div
                className="text-xs"
                style={{ color: "oklch(0.63 0.028 220)" }}
              >
                Current Price
              </div>
              <div className="text-xl font-black" style={{ color: meta.color }}>
                ${price.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                data-ocid="trade.buy.button"
                onClick={() => setDir(Direction.buy)}
                className="py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                style={{
                  background: buyBg,
                  border: `1px solid ${buyBorder}`,
                  color: buyColor,
                }}
              >
                Buy
              </button>
              <button
                type="button"
                data-ocid="trade.sell.button"
                onClick={() => setDir(Direction.sell)}
                className="py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                style={{
                  background: sellBg,
                  border: `1px solid ${sellBorder}`,
                  color: sellColor,
                }}
              >
                Sell
              </button>
            </div>

            <div>
              <Label
                htmlFor="qty"
                className="text-xs font-semibold uppercase tracking-wider mb-1.5 block"
                style={{ color: "oklch(0.63 0.028 220)" }}
              >
                Quantity ({coin})
              </Label>
              <Input
                id="qty"
                data-ocid="trade.input"
                type="number"
                step={meta.step}
                min={meta.min}
                placeholder={`Min ${meta.min}`}
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                style={{
                  background: "oklch(0.20 0.030 230)",
                  border: "1px solid oklch(0.23 0.036 225)",
                  color: "oklch(0.94 0.012 220)",
                }}
              />
            </div>

            {Number.parseFloat(qty) > 0 && (
              <div
                className="p-3 rounded-lg"
                style={{ background: "oklch(0.20 0.030 230)" }}
              >
                <div className="flex justify-between text-xs">
                  <span style={{ color: "oklch(0.63 0.028 220)" }}>
                    Estimated Total
                  </span>
                  <span
                    className="font-bold"
                    style={{ color: "oklch(0.94 0.012 220)" }}
                  >
                    $
                    {total.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            data-ocid="trade.cancel_button"
            variant="outline"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid oklch(0.23 0.036 225)",
              color: "oklch(0.63 0.028 220)",
            }}
          >
            Cancel
          </Button>
          <Button
            data-ocid="trade.submit_button"
            onClick={handleSubmit}
            disabled={isDisabled}
            style={{
              background: submitBg,
              color: "oklch(0.10 0.02 243)",
              border: "none",
              opacity: isDisabled ? 0.5 : 1,
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                Executing...
              </>
            ) : (
              `Confirm ${isBuyDir ? "Buy" : "Sell"}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
