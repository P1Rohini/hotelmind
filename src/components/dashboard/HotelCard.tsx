import { Star, MapPin, Wifi, Waves, Dumbbell, UtensilsCrossed } from "lucide-react";
import { Hotel } from "@/data/hotels";
import { motion } from "framer-motion";

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-3.5 h-3.5" />,
  Pool: <Waves className="w-3.5 h-3.5" />,
  Gym: <Dumbbell className="w-3.5 h-3.5" />,
  Restaurant: <UtensilsCrossed className="w-3.5 h-3.5" />,
};

interface HotelCardProps {
  hotel: Hotel;
  index: number;
  onSelect: (hotel: Hotel) => void;
}

export default function HotelCard({ hotel, index, onSelect }: HotelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-border group cursor-pointer"
      onClick={() => onSelect(hotel)}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-xs font-semibold text-foreground">{hotel.rating}</span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-primary/80 backdrop-blur-sm text-primary-foreground text-[11px] font-medium px-2.5 py-1 rounded-full">
            {hotel.type}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-base font-bold text-foreground mb-1">{hotel.name}</h3>
        <div className="flex items-center gap-1.5 text-muted-foreground mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-xs">{hotel.location}</span>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {hotel.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-[11px] px-2 py-1 rounded-lg"
            >
              {amenityIcons[amenity] || null}
              {amenity}
            </span>
          ))}
        </div>

        <div className="flex items-end justify-between">
          <div>
            <span className="text-xl font-bold text-foreground">${hotel.pricePerNight}</span>
            <span className="text-xs text-muted-foreground ml-1">/ night</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(hotel); }}
            className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors duration-200"
          >
            Select
          </button>
        </div>
      </div>
    </motion.div>
  );
}
