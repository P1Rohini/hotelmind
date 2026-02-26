import { useState, useCallback } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import ChatPanel from "@/components/dashboard/ChatPanel";
import HotelResults from "@/components/dashboard/HotelResults";
import DashboardPanel from "@/components/dashboard/DashboardPanel";
import BookingsPanel from "@/components/dashboard/BookingsPanel";
import SavedHotelsPanel from "@/components/dashboard/SavedHotelsPanel";
import PlaceholderPanel from "@/components/dashboard/PlaceholderPanel";
import { SessionState, Booking, ChatMessage } from "@/types/booking";
import { Hotel } from "@/data/hotels";
import { toast } from "sonner";
import { Tag, Headphones, User, Settings, BarChart3 } from "lucide-react";

const initialSession: SessionState = {
  authentication_status: true,
  current_intent: "GENERAL_QUERY",
  collected_parameters: {
    destination: null,
    check_in: null,
    check_out: null,
    guests: null,
  },
  selected_hotel_id: null,
  booking_status: null,
};

function getNights(checkIn: string | null, checkOut: string | null): number {
  if (!checkIn || !checkOut) return 1;
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}

export default function Index() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [session, setSession] = useState<SessionState>(initialSession);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savedHotels] = useState<Hotel[]>([]);
  const [externalMessages, setExternalMessages] = useState<ChatMessage[]>([]);

  const handleSelectHotel = useCallback((hotel: Hotel) => {
    setSelectedHotel(hotel);
    setActiveNav("search");
    setSession((s) => ({ ...s, selected_hotel_id: hotel.id, current_intent: "SELECT_HOTEL" }));
  }, []);

  const handleBook = useCallback(() => {
    if (!selectedHotel) return;
    const { check_in, check_out, guests } = session.collected_parameters;
    const nights = getNights(check_in, check_out);
    const totalPrice = selectedHotel.pricePerNight * nights;
    const bookingId = `BK-${Date.now().toString(36).toUpperCase()}`;

    const newBooking: Booking = {
      id: bookingId,
      hotelId: selectedHotel.id,
      hotelName: selectedHotel.name,
      hotelImage: selectedHotel.image,
      hotelLocation: selectedHotel.location,
      checkIn: check_in || "—",
      checkOut: check_out || "—",
      guests: guests || 2,
      totalPrice,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [...prev, newBooking]);
    setSession((s) => ({ ...s, booking_status: "confirmed", current_intent: "BOOK_HOTEL" }));

    toast.success(`Booking confirmed for ${selectedHotel.name}!`, {
      description: `${check_in} — ${check_out} · ${guests} guests`,
    });

    const confirmMsg: ChatMessage = {
      id: `confirm-${bookingId}`,
      role: "bot",
      type: "confirmation",
      content: `Booking Confirmed 🎉\n\n🏨 **Hotel:** ${selectedHotel.name}\n📍 **Destination:** ${selectedHotel.location}\n📅 **Check-in:** ${check_in}\n📅 **Check-out:** ${check_out}\n👥 **Guests:** ${guests}\n💰 **Total Price:** $${totalPrice}\n🆔 **Booking ID:** ${bookingId}`,
    };
    setExternalMessages((prev) => [...prev, confirmMsg]);
    setSelectedHotel(null);
  }, [selectedHotel, session.collected_parameters]);

  const handleCancelBooking = useCallback((bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" as const } : b))
    );
    const booking = bookings.find((b) => b.id === bookingId);
    toast.info(`Booking ${bookingId} cancelled.`);

    const cancelMsg: ChatMessage = {
      id: `cancel-${bookingId}`,
      role: "bot",
      content: `Your booking for **${booking?.hotelName || "the hotel"}** (ID: ${bookingId}) has been cancelled successfully. ❌`,
    };
    setExternalMessages((prev) => [...prev, cancelMsg]);
  }, [bookings]);

  const renderMiddlePanel = () => {
    switch (activeNav) {
      case "dashboard":
        return <DashboardPanel bookings={bookings} savedCount={savedHotels.length} onNavigate={setActiveNav} />;
      case "search":
        return (
          <HotelResults
            hotels={hotels}
            selectedHotel={selectedHotel}
            checkIn={session.collected_parameters.check_in}
            checkOut={session.collected_parameters.check_out}
            guests={session.collected_parameters.guests}
            destination={session.collected_parameters.destination}
            onSelectHotel={handleSelectHotel}
            onBack={() => setSelectedHotel(null)}
            onBook={handleBook}
          />
        );
      case "bookings":
        return <BookingsPanel bookings={bookings} onCancel={handleCancelBooking} />;
      case "saved":
        return <SavedHotelsPanel savedHotels={savedHotels} onSelectHotel={handleSelectHotel} />;
      case "offers":
        return <PlaceholderPanel title="Offers & Deals" description="Exclusive hotel deals and promotions will appear here." icon={Tag} />;
      case "reports":
        return <PlaceholderPanel title="Reports" description="Analytics and booking reports will appear here." icon={BarChart3} />;
      case "support":
        return <PlaceholderPanel title="Support" description="Get help and contact our support team." icon={Headphones} />;
      case "account":
        return <PlaceholderPanel title="Account" description="Manage your profile and account settings." icon={User} />;
      case "settings":
        return <PlaceholderPanel title="Settings" description="Configure your account preferences and notifications." icon={Settings} />;
      default:
        return <DashboardPanel bookings={bookings} savedCount={savedHotels.length} onNavigate={setActiveNav} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar activeItem={activeNav} onItemClick={setActiveNav} />
      <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        {renderMiddlePanel()}
      </main>
      <ChatPanel
        session={session}
        onSessionUpdate={setSession}
        onHotelsFound={(h) => { setHotels(h); setSelectedHotel(null); }}
        onSelectHotel={handleSelectHotel}
        onNavigate={setActiveNav}
        externalMessages={externalMessages}
        onClearExternal={() => setExternalMessages([])}
      />
    </div>
  );
}
