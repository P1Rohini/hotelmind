import hotel1 from "@/assets/hotel-1.jpg";
import hotel2 from "@/assets/hotel-2.jpg";
import hotel3 from "@/assets/hotel-3.jpg";
import hotel4 from "@/assets/hotel-4.jpg";
import hotel5 from "@/assets/hotel-5.jpg";
import hotel6 from "@/assets/hotel-6.jpg";

export interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  image: string;
  amenities: string[];
  type: string;
  description: string;
}

export const hotels: Hotel[] = [
  {
    id: "H001",
    name: "The Palm Royale",
    location: "Dubai Marina, Dubai",
    city: "Dubai",
    rating: 4.8,
    reviewCount: 2341,
    pricePerNight: 320,
    image: hotel1,
    amenities: ["Pool", "Spa", "WiFi", "Gym", "Restaurant"],
    type: "Luxury Resort",
    description: "A stunning waterfront resort with panoramic views of the marina skyline.",
  },
  {
    id: "H002",
    name: "Grand Heritage Palace",
    location: "Downtown, Paris",
    city: "Paris",
    rating: 4.9,
    reviewCount: 1876,
    pricePerNight: 450,
    image: hotel2,
    amenities: ["Spa", "WiFi", "Restaurant", "Bar", "Concierge"],
    type: "Boutique Hotel",
    description: "An exquisite boutique hotel blending classic Parisian elegance with modern luxury.",
  },
  {
    id: "H003",
    name: "Azure Beach Resort",
    location: "Seminyak, Bali",
    city: "Bali",
    rating: 4.7,
    reviewCount: 3102,
    pricePerNight: 185,
    image: hotel3,
    amenities: ["Beach", "Pool", "Spa", "WiFi", "Restaurant"],
    type: "Beach Resort",
    description: "A tropical paradise with pristine beaches and world-class amenities.",
  },
  {
    id: "H004",
    name: "Alpine Luxe Lodge",
    location: "Zermatt, Switzerland",
    city: "Zermatt",
    rating: 4.6,
    reviewCount: 892,
    pricePerNight: 380,
    image: hotel4,
    amenities: ["Ski-in/out", "Spa", "WiFi", "Fireplace", "Restaurant"],
    type: "Mountain Lodge",
    description: "A cozy alpine retreat with breathtaking mountain views and ski access.",
  },
  {
    id: "H005",
    name: "Skyline Metropolitan",
    location: "Manhattan, New York",
    city: "New York",
    rating: 4.5,
    reviewCount: 4210,
    pricePerNight: 290,
    image: hotel5,
    amenities: ["Rooftop Bar", "WiFi", "Gym", "Restaurant", "Concierge"],
    type: "City Hotel",
    description: "A sleek urban hotel in the heart of Manhattan with stunning skyline views.",
  },
  {
    id: "H006",
    name: "Coral Villa Retreat",
    location: "North Malé Atoll, Maldives",
    city: "Maldives",
    rating: 4.9,
    reviewCount: 1567,
    pricePerNight: 620,
    image: hotel6,
    amenities: ["Overwater Villa", "Snorkeling", "Spa", "WiFi", "Private Pool"],
    type: "Luxury Villa",
    description: "An exclusive overwater villa experience in crystal-clear Maldivian waters.",
  },
];

export function searchHotels(destination: string): Hotel[] {
  const query = destination.toLowerCase();
  return hotels.filter(
    (h) =>
      h.city.toLowerCase().includes(query) ||
      h.location.toLowerCase().includes(query) ||
      h.name.toLowerCase().includes(query)
  );
}

export function getHotelById(id: string): Hotel | undefined {
  return hotels.find((h) => h.id === id);
}
