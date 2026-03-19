import {
  BarChart2,
  Bot,
  Briefcase,
  History,
  LayoutDashboard,
  Settings,
} from "lucide-react";

const ICONS = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: BarChart2, label: "Markets", active: false },
  { icon: Briefcase, label: "Portfolio", active: false },
  { icon: Bot, label: "AI Agent", active: false },
  { icon: History, label: "History", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export default function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-14 bottom-0 z-40 flex flex-col items-center py-4 gap-2 w-14"
      style={{
        background: "oklch(0.13 0.025 235)",
        borderRight: "1px solid oklch(0.23 0.036 225)",
      }}
    >
      {ICONS.map(({ icon: Icon, label, active }, i) => (
        <button
          type="button"
          key={label}
          data-ocid={`sidebar.link.${i + 1}`}
          title={label}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{
            background: active ? "oklch(0.84 0.21 152 / 0.15)" : "transparent",
            color: active ? "oklch(0.84 0.21 152)" : "oklch(0.63 0.028 220)",
            border: active
              ? "1px solid oklch(0.84 0.21 152 / 0.3)"
              : "1px solid transparent",
          }}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </aside>
  );
}
