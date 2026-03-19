import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, ChevronDown, Wallet } from "lucide-react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

const NAV_LINKS = [
  "Overview",
  "Markets",
  "Portfolio",
  "AI Agent",
  "History",
  "Settings",
];

export default function Navbar() {
  const { clear, identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() ?? "";
  const shortId = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-3)}`
    : "Alex R.";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center h-14 px-4 gap-6"
      style={{
        background: "oklch(0.13 0.025 235)",
        borderBottom: "1px solid oklch(0.23 0.036 225)",
      }}
    >
      <div className="flex items-center gap-2 shrink-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm glow-green"
          style={{
            background: "oklch(0.84 0.21 152)",
            color: "oklch(0.10 0.02 243)",
          }}
        >
          A
        </div>
        <span
          className="font-black text-sm tracking-widest uppercase"
          style={{ color: "oklch(0.94 0.012 220)" }}
        >
          CryptoAgent
        </span>
      </div>

      <nav className="hidden lg:flex items-center gap-1 flex-1">
        {NAV_LINKS.map((link, i) => (
          <button
            type="button"
            key={link}
            data-ocid={`nav.link.${i + 1}`}
            className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors"
            style={{
              color: i === 0 ? "oklch(0.84 0.21 152)" : "oklch(0.63 0.028 220)",
              background:
                i === 0 ? "oklch(0.84 0.21 152 / 0.1)" : "transparent",
            }}
          >
            {link}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2 ml-auto">
        <Button
          data-ocid="nav.wallet.button"
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
          style={{
            background: "oklch(0.84 0.21 152 / 0.1)",
            border: "1px solid oklch(0.84 0.21 152 / 0.3)",
            color: "oklch(0.84 0.21 152)",
          }}
        >
          <Wallet className="w-3 h-3" />
          Wallet
        </Button>

        <button
          type="button"
          data-ocid="nav.bell.button"
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{
            background: "oklch(0.20 0.030 230)",
            color: "oklch(0.63 0.028 220)",
          }}
        >
          <Bell className="w-4 h-4" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              data-ocid="nav.profile.dropdown_menu"
              className="flex items-center gap-2 px-2 py-1 rounded-lg transition-colors"
              style={{
                background: "oklch(0.20 0.030 230)",
                border: "1px solid oklch(0.23 0.036 225)",
              }}
            >
              <Avatar className="w-6 h-6">
                <AvatarFallback
                  className="text-xs font-bold"
                  style={{
                    background: "oklch(0.84 0.21 152)",
                    color: "oklch(0.10 0.02 243)",
                  }}
                >
                  A
                </AvatarFallback>
              </Avatar>
              <span
                className="text-xs font-medium hidden sm:block"
                style={{ color: "oklch(0.94 0.012 220)" }}
              >
                {shortId}
              </span>
              <ChevronDown
                className="w-3 h-3"
                style={{ color: "oklch(0.63 0.028 220)" }}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            style={{
              background: "oklch(0.16 0.032 230)",
              border: "1px solid oklch(0.23 0.036 225)",
            }}
          >
            <DropdownMenuItem
              data-ocid="nav.logout.button"
              onClick={clear}
              className="text-xs cursor-pointer"
              style={{ color: "oklch(0.61 0.18 22)" }}
            >
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
