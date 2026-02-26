import { Hotel } from "@/data/hotels";
import HotelCard from "./HotelCard";
import HotelDetail from "./HotelDetail";
import { Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface HotelResultsProps {
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  checkIn: string | null;
  checkOut: string | null;
  guests: number | null;
  destination: string | null;
  onSelectHotel: (hotel: Hotel) => void;
  onBack: () => void;
  onBook: () => void;
}

export default function HotelResults({
  hotels, selectedHotel, checkIn, checkOut, guests, destination,
  onSelectHotel, onBack, onBook,
}: HotelResultsProps) {
  if (selectedHotel) {
    return (
      <HotelDetail hotel={selectedHotel} checkIn={checkIn} checkOut={checkOut} guests={guests} onBack={onBack} onBook={onBook} />
    );
  }

  if (hotels.length > 0) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-5">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Hotels in {destination}</h2>
          <span className="text-sm text-muted-foreground ml-2">({hotels.length} found)</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {hotels.map((hotel, i) => (
            <HotelCard key={hotel.id} hotel={hotel} index={i} onSelect={onSelectHotel} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center py-20">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
        <Search className="w-9 h-9 text-primary/50" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Find Your Perfect Stay</h2>
      <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
        Use the chat assistant to search for hotels. Tell BookBot your destination, dates, and number of guests.
      </p>
    </motion.div>
  );
}
