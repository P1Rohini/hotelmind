import {
  Home,
  Search,
  CalendarCheck,
  Heart,
  BarChart3,
  Tag,
  Headphones,
  User,
  Settings,
  LogOut,
  Hotel,
} from "lucide-react";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const mainMenu = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "search", label: "Search Hotels", icon: Search },
  { id: "bookings", label: "My Bookings", icon: CalendarCheck },
  { id: "saved", label: "Saved Hotels", icon: Heart },
  { id: "offers", label: "Offers / Deals", icon: Tag },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "support", label: "Support", icon: Headphones },
];

const systemMenu = [
  { id: "account", label: "Account", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar flex flex-col h-screen shrink-0">
      {/* Brand */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Hotel className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <span className="text-base font-bold text-primary-foreground tracking-wide">
            HotelMind
          </span>
          <p className="text-[10px] text-sidebar-foreground/50 leading-tight">
            Intelligent Booking Assistant
          </p>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 mt-2 overflow-y-auto scrollbar-thin">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 px-3 mb-2">
          Menu
        </p>
        <ul className="space-y-0.5">
          {mainMenu.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeItem === item.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-sidebar-foreground hover:bg-sidebar-muted hover:text-primary-foreground"
                }`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 px-3 mb-2 mt-6">
          System
        </p>
        <ul className="space-y-0.5">
          {systemMenu.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeItem === item.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-sidebar-foreground hover:bg-sidebar-muted hover:text-primary-foreground"
                }`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 mb-2">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-sidebar-muted hover:text-destructive transition-all duration-200">
          <LogOut className="w-[18px] h-[18px]" />
          <span>Logout</span>
        </button>
      </div>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sidebar-muted flex items-center justify-center text-sm font-semibold text-primary">
            GU
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary-foreground truncate">
              Guest User
            </p>
            <p className="text-[11px] text-sidebar-foreground/50 truncate">
              Free Plan
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
