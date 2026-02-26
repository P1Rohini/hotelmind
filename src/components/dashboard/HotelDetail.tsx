import { Star, MapPin, ArrowLeft, Check } from "lucide-react";
import { Hotel } from "@/data/hotels";
import { motion } from "framer-motion";

interface HotelDetailProps {
  hotel: Hotel;
  checkIn: string | null;
  checkOut: string | null;
  guests: number | null;
  onBack: () => void;
  onBook: () => void;
}

function getNights(checkIn: string | null, checkOut: string | null): number {
  if (!checkIn || !checkOut) return 1;
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}

export default function HotelDetail({ hotel, checkIn, checkOut, guests, onBack, onBook }: HotelDetailProps) {
  const nights = getNights(checkIn, checkOut);
  const total = hotel.pricePerNight * nights;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to results
      </button>

      <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border">
        <div className="relative h-64">
          <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-5">
            <h2 className="text-2xl font-bold text-white">{hotel.name}</h2>
            <div className="flex items-center gap-2 text-white/80 mt-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{hotel.location}</span>
            </div>
          </div>
          <div className="absolute bottom-4 right-5 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-foreground">{hotel.rating}</span>
            <span className="text-xs text-muted-foreground">({hotel.reviewCount})</span>
          </div>
        </div>

        <div className="p-5">
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{hotel.description}</p>

          <div className="flex gap-2 flex-wrap mb-6">
            {hotel.amenities.map((a) => (
              <span key={a} className="flex items-center gap-1.5 bg-secondary text-secondary-foreground text-xs px-3 py-1.5 rounded-full">
                <Check className="w-3 h-3 text-primary" />
                {a}
              </span>
            ))}
          </div>

          <div className="bg-secondary rounded-2xl p-4 space-y-3">
            <h4 className="text-base font-bold text-foreground">Booking Summary</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Check-in</span>
                <p className="font-medium text-foreground">{checkIn || "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Check-out</span>
                <p className="font-medium text-foreground">{checkOut || "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Guests</span>
                <p className="font-medium text-foreground">{guests || "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Nights</span>
                <p className="font-medium text-foreground">{nights}</p>
              </div>
            </div>

            <div className="border-t border-border pt-3 flex items-center justify-between">
              <div>
                <span className="text-sm text-muted-foreground">Total Price</span>
                <p className="text-2xl font-bold text-foreground">${total}</p>
              </div>
              <button
                onClick={onBook}
                className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors duration-200"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
