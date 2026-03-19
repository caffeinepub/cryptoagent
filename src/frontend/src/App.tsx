import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./components/trading/Dashboard";
import LoginPage from "./components/trading/LoginPage";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 10_000,
    },
  },
});

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-terminal-green border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Initializing...</span>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <LoginPage />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.16 0.032 230)",
            border: "1px solid oklch(0.23 0.036 225)",
            color: "oklch(0.94 0.012 220)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
