export interface SessionState {
  authentication_status: boolean;
  current_intent: string;
  collected_parameters: {
    destination: string | null;
    check_in: string | null;
    check_out: string | null;
    guests: number | null;
  };
  selected_hotel_id: string | null;
  booking_status: string | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  type?: "text" | "summary" | "confirmation";
}

export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  hotelLocation: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "confirmed" | "cancelled" | "pending";
  createdAt: string;
}
