import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Coin, Direction } from "../backend.d";
import { useActor } from "./useActor";

export function useLivePrices() {
  const { actor, isFetching } = useActor();

  return useQuery<Record<Coin, number>>({
    queryKey: ["livePrices"],
    queryFn: async () => {
      if (!actor) return getFallbackPrices();
      try {
        const [btc, eth, sol, bnb] = await Promise.all([
          actor.getLivePrice(Coin.BTC).catch(() => FALLBACK_PRICES[Coin.BTC]),
          actor.getLivePrice(Coin.ETH).catch(() => FALLBACK_PRICES[Coin.ETH]),
          actor.getLivePrice(Coin.SOL).catch(() => FALLBACK_PRICES[Coin.SOL]),
          actor.getLivePrice(Coin.BNB).catch(() => FALLBACK_PRICES[Coin.BNB]),
        ]);
        return {
          [Coin.BTC]: btc,
          [Coin.ETH]: eth,
          [Coin.SOL]: sol,
          [Coin.BNB]: bnb,
        } as Record<Coin, number>;
      } catch {
        return getFallbackPrices();
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15_000,
    placeholderData: getFallbackPrices(),
  });
}

export function usePortfolioStats() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["portfolioStats"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getPortfolioStats();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15_000,
  });
}

export function useToggleAgent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.toggleAutomatedTrading();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolioStats"] });
      toast.success("Agent status updated");
    },
    onError: () => {
      toast.error("Failed to toggle agent");
    },
  });
}

export function useTrade() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      coin,
      direction,
      quantity,
    }: { coin: Coin; direction: Direction; quantity: number }) => {
      if (!actor) throw new Error("No actor");
      return actor.trade(coin, direction, quantity);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["portfolioStats"] });
      toast.success(`${vars.direction.toUpperCase()} order executed`);
    },
    onError: (err: any) => {
      toast.error(`Trade failed: ${err?.message ?? "Unknown error"}`);
    },
  });
}

export function useResetPortfolio() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.resetPortfolio();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolioStats"] });
      queryClient.invalidateQueries({ queryKey: ["livePrices"] });
      toast.success("Portfolio reset to $10,000");
    },
    onError: () => {
      toast.error("Failed to reset portfolio");
    },
  });
}

const FALLBACK_PRICES: Record<Coin, number> = {
  [Coin.BTC]: 48250,
  [Coin.ETH]: 2580,
  [Coin.SOL]: 142,
  [Coin.BNB]: 385,
};

function getFallbackPrices(): Record<Coin, number> {
  return { ...FALLBACK_PRICES };
}

export { Coin, Direction };
