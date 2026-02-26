import { CalendarCheck, Clock, DollarSign, Search, CalendarRange, Tag } from "lucide-react";
import { Booking } from "@/types/booking";
import { motion } from "framer-motion";

interface DashboardPanelProps {
  bookings: Booking[];
  savedCount: number;
  onNavigate: (nav: string) => void;
}

export default function DashboardPanel({ bookings, savedCount, onNavigate }: DashboardPanelProps) {
  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const totalSpent = bookings.reduce((sum, b) => b.status === "confirmed" ? sum + b.totalPrice : sum, 0);

  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: CalendarCheck, color: "text-primary" },
    { label: "Active Reservations", value: confirmed.length, icon: Clock, color: "text-emerald-500" },
    { label: "Amount Spent", value: `$${totalSpent.toLocaleString()}`, icon: DollarSign, color: "text-amber-500" },
  ];

  const quickActions = [
    { id: "search", label: "Search Hotels", desc: "Find the best hotel deals", icon: Search },
    { id: "bookings", label: "My Bookings", desc: "View and manage reservations", icon: CalendarRange },
    { id: "offers", label: "Budget Friendly Deals", desc: "Explore affordable hotel options", icon: Tag },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Hero Section */}
      <div className="rounded-2xl bg-gradient-to-r from-[hsl(220,70%,50%)] to-[hsl(240,60%,40%)] p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/20" />
          <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-white/10" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome to HotelMind</h1>
          <p className="text-white/80 max-w-lg text-sm leading-relaxed mb-6">
            Your intelligent hotel booking assistant. Search, compare, and book hotels with AI-powered support that always finds the best deals.
          </p>
          <button
            onClick={() => onNavigate("search")}
            className="bg-white text-[hsl(220,70%,50%)] font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors inline-flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search Hotels →
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <span className="text-sm text-muted-foreground font-medium">{s.label}</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onNavigate(action.id)}
              className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-200 text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <action.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-1">{action.label}</h3>
              <p className="text-sm text-muted-foreground">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Stays */}
      {confirmed.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Upcoming Stays</h2>
          <div className="space-y-3">
            {confirmed.map((b) => (
              <div key={b.id} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4 shadow-sm">
                <img src={b.hotelImage} alt={b.hotelName} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{b.hotelName}</p>
                  <p className="text-xs text-muted-foreground">{b.checkIn} — {b.checkOut} · {b.guests} guests</p>
                </div>
                <span className="text-primary font-bold text-lg">${b.totalPrice}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
