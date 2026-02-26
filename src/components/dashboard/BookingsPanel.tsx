import { Booking } from "@/types/booking";
import { CalendarCheck, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface BookingsPanelProps {
  bookings: Booking[];
  onCancel: (bookingId: string) => void;
}

export default function BookingsPanel({ bookings, onCancel }: BookingsPanelProps) {
  if (bookings.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-20">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
          <CalendarCheck className="w-9 h-9 text-primary/50" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">No Bookings Yet</h2>
        <p className="text-muted-foreground text-sm">Use the chat assistant to search and book hotels.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-foreground mb-6">My Bookings</h2>
      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="flex">
              <img src={b.hotelImage} alt={b.hotelName} className="w-32 h-32 object-cover" />
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{b.hotelName}</h3>
                    <p className="text-xs text-muted-foreground">{b.hotelLocation}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    b.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {b.status === "confirmed" ? "Confirmed" : "Cancelled"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs">Check-in</span>
                    <p className="text-foreground font-medium">{b.checkIn}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Check-out</span>
                    <p className="text-foreground font-medium">{b.checkOut}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Guests</span>
                    <p className="text-foreground font-medium">{b.guests}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div>
                    <span className="text-xs text-muted-foreground">Total</span>
                    <p className="text-lg font-bold text-foreground">${b.totalPrice}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">ID: {b.id}</span>
                    {b.status === "confirmed" && (
                      <button
                        onClick={() => onCancel(b.id)}
                        className="flex items-center gap-1 bg-destructive/10 text-destructive text-xs font-medium px-3 py-1.5 rounded-xl hover:bg-destructive/20 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
