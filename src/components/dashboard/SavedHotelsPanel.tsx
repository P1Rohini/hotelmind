import { Hotel } from "@/data/hotels";
import { Heart } from "lucide-react";
import HotelCard from "./HotelCard";
import { motion } from "framer-motion";

interface SavedHotelsPanelProps {
  savedHotels: Hotel[];
  onSelectHotel: (hotel: Hotel) => void;
}

export default function SavedHotelsPanel({ savedHotels, onSelectHotel }: SavedHotelsPanelProps) {
  if (savedHotels.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-20">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
          <Heart className="w-9 h-9 text-primary/50" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">No Saved Hotels</h2>
        <p className="text-muted-foreground text-sm">Hotels you save will appear here.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-foreground mb-6">Saved Hotels</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {savedHotels.map((hotel, i) => (
          <HotelCard key={hotel.id} hotel={hotel} index={i} onSelect={onSelectHotel} />
        ))}
      </div>
    </motion.div>
  );
}
