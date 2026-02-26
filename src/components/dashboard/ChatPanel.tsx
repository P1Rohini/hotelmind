import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { ChatMessage, SessionState } from "@/types/booking";
import { Hotel, searchHotels, hotels as allHotels } from "@/data/hotels";
import { motion, AnimatePresence } from "framer-motion";

interface ChatPanelProps {
  session: SessionState;
  onSessionUpdate: (session: SessionState) => void;
  onHotelsFound: (hotels: Hotel[]) => void;
  onSelectHotel: (hotel: Hotel) => void;
  onNavigate: (nav: string) => void;
  externalMessages: ChatMessage[];
  onClearExternal: () => void;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: "init",
  role: "bot",
  content: "Hello! 👋 I'm BookBot. I can help you:\n\n• Find budget-friendly hotels\n• Compare hotel options\n• Answer cancellation policies\n• Help with booking or cancellation",
};

const quickSuggestions = [
  "Suggest budget hotels",
  "Free cancellation hotels",
  "Near airport",
  "5-star hotels",
  "Modify booking",
  "Cancel reservation",
];

export default function ChatPanel({
  session,
  onSessionUpdate,
  onHotelsFound,
  onNavigate,
  externalMessages,
  onClearExternal,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (externalMessages.length > 0) {
      setMessages((prev) => [...prev, ...externalMessages]);
      onClearExternal();
    }
  }, [externalMessages, onClearExternal]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function addBot(content: string, type?: ChatMessage["type"]) {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "bot", content, type },
    ]);
  }

  function handleSend(text?: string) {
    const msg = (text || input).trim();
    if (!msg) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => processInput(msg), 400);
  }

  function applyFilters(text: string): Hotel[] | null {
    const lower = text.toLowerCase();
    let filtered = [...allHotels];
    let applied = false;

    const priceMatch = lower.match(/under\s*\$?(\d+)/);
    if (priceMatch) {
      const max = parseInt(priceMatch[1]);
      filtered = filtered.filter((h) => h.pricePerNight <= max);
      applied = true;
    }
    if (lower.includes("budget") || lower.includes("cheap") || lower.includes("affordable")) {
      filtered = filtered.filter((h) => h.pricePerNight <= 250);
      applied = true;
    }

    const ratingMatch = lower.match(/(\d+)[- ]*star/);
    if (ratingMatch) {
      const minRating = parseInt(ratingMatch[1]);
      filtered = filtered.filter((h) => h.rating >= minRating);
      applied = true;
    }
    if (lower.includes("5-star") || lower.includes("5 star") || lower.includes("five star")) {
      filtered = filtered.filter((h) => h.rating >= 4.9);
      applied = true;
    }

    const amenityKeywords = ["pool", "spa", "wifi", "gym", "restaurant", "bar", "beach", "ski"];
    for (const kw of amenityKeywords) {
      if (lower.includes(kw)) {
        filtered = filtered.filter((h) =>
          h.amenities.some((a) => a.toLowerCase().includes(kw))
        );
        applied = true;
      }
    }

    if (lower.includes("resort")) { filtered = filtered.filter((h) => h.type.toLowerCase().includes("resort")); applied = true; }
    if (lower.includes("villa")) { filtered = filtered.filter((h) => h.type.toLowerCase().includes("villa")); applied = true; }
    if (lower.includes("boutique")) { filtered = filtered.filter((h) => h.type.toLowerCase().includes("boutique")); applied = true; }

    if (lower.includes("free cancellation") || lower.includes("cancellation")) {
      applied = true; // All hotels support free cancellation in our system
    }

    return applied ? filtered : null;
  }

  function handleHotelQuestions(text: string): boolean {
    const lower = text.toLowerCase();

    if (lower.includes("cheaper") || lower.includes("cheapest") || lower.includes("lowest price")) {
      const sorted = [...allHotels].sort((a, b) => a.pricePerNight - b.pricePerNight);
      onHotelsFound(sorted);
      onNavigate("search");
      addBot(`The most affordable option is **${sorted[0].name}** at **$${sorted[0].pricePerNight}/night** in ${sorted[0].location}. I've sorted the results by price for you!`);
      return true;
    }

    if (lower.includes("expensive") || lower.includes("luxury") || lower.includes("best")) {
      const sorted = [...allHotels].sort((a, b) => b.pricePerNight - a.pricePerNight);
      onHotelsFound(sorted);
      onNavigate("search");
      addBot(`The most luxurious option is **${sorted[0].name}** at **$${sorted[0].pricePerNight}/night**. Results sorted by price!`);
      return true;
    }

    if (lower.includes("compare")) {
      const comparison = allHotels.map((h) => `• **${h.name}** — $${h.pricePerNight}/night ⭐${h.rating}`).join("\n");
      addBot(`Here's a quick comparison:\n\n${comparison}`);
      return true;
    }

    if (lower.includes("cancellation") || lower.includes("cancel policy")) {
      addBot("All our hotels offer **free cancellation** up to 24 hours before check-in. You can cancel from **My Bookings**.");
      return true;
    }

    if (lower.includes("cancel reservation") || lower.includes("cancel my booking")) {
      onNavigate("bookings");
      addBot("I've opened your bookings page. You can cancel any confirmed booking from there. 📋");
      return true;
    }

    if (lower.includes("modify booking") || lower.includes("change booking")) {
      onNavigate("bookings");
      addBot("Here are your bookings. To modify, cancel the existing one and create a new booking with updated details.");
      return true;
    }

    return false;
  }

  function processInput(text: string) {
    const params = { ...session.collected_parameters };
    const lowerText = text.toLowerCase();

    const filterResults = applyFilters(text);
    if (filterResults) {
      onHotelsFound(filterResults);
      onNavigate("search");
      if (filterResults.length > 0) {
        addBot(`I found **${filterResults.length} hotel${filterResults.length > 1 ? "s" : ""}** matching your filters. Check them out!`);
      } else {
        addBot("No hotels match those filters. Try adjusting your criteria.");
      }
      return;
    }

    if (handleHotelQuestions(text)) return;

    // Slot filling
    if (!params.destination) {
      params.destination = text;
      onSessionUpdate({ ...session, current_intent: "HOTEL_SEARCH", collected_parameters: params });
      addBot(`Great choice — **${text}**! 📍\n\nWhat are your check-in and check-out dates? (e.g., June 10 - June 13, 2026)`);
      return;
    }

    if (!params.check_in || !params.check_out) {
      const datePattern = /(\w+ \d{1,2}),?\s*(\d{4})?/g;
      const matches = [...text.matchAll(datePattern)];
      if (matches.length >= 2) {
        const year = matches[0][2] || matches[1][2] || "2026";
        params.check_in = `${matches[0][1]}, ${year}`;
        params.check_out = `${matches[1][1]}, ${year}`;
      } else if (matches.length === 1) {
        const parts = text.split(/\s*[-–to]+\s*/i);
        if (parts.length >= 2) {
          const year = matches[0][2] || "2026";
          params.check_in = parts[0].trim().replace(/,?\s*\d{4}/, "") + `, ${year}`;
          params.check_out = parts[1].trim().replace(/,?\s*\d{4}/, "") + `, ${year}`;
        } else {
          params.check_in = `${matches[0][1]}, ${matches[0][2] || "2026"}`;
          addBot("Got the check-in date. What's your check-out date?");
          onSessionUpdate({ ...session, collected_parameters: params });
          return;
        }
      } else {
        if (!params.check_in) {
          params.check_in = text;
          addBot("And the check-out date?");
          onSessionUpdate({ ...session, collected_parameters: params });
          return;
        } else {
          params.check_out = text;
        }
      }
      onSessionUpdate({ ...session, collected_parameters: params });
      addBot("How many guests will be staying? 👥");
      return;
    }

    if (!params.guests) {
      const num = parseInt(text.match(/\d+/)?.[0] || "");
      params.guests = isNaN(num) ? 2 : num;
      onSessionUpdate({ ...session, collected_parameters: params, current_intent: "HOTEL_SEARCH" });

      const summary = `Here are your travel details:\n\n📍 **Destination:** ${params.destination}\n📅 **Check-in:** ${params.check_in}\n📅 **Check-out:** ${params.check_out}\n👥 **Guests:** ${params.guests}\n\n🔍 Searching for available hotels...`;
      addBot(summary, "summary");

      setTimeout(() => {
        const results = searchHotels(params.destination!);
        onNavigate("search");
        if (results.length > 0) {
          onHotelsFound(results);
          addBot(`I found **${results.length} hotel${results.length > 1 ? "s" : ""}** matching your criteria. Take a look and select one!`);
        } else {
          onHotelsFound(allHotels);
          addBot(`I couldn't find exact matches for "${params.destination}", but here are some excellent options!`);
        }
      }, 1200);
      return;
    }

    if (lowerText.includes("book") || lowerText.includes("confirm") || lowerText.includes("yes")) {
      addBot("Please select a hotel from the results panel to proceed with your booking! 👈");
      return;
    }

    if (lowerText.includes("change") || lowerText.includes("new search") || lowerText.includes("different")) {
      onSessionUpdate({
        ...session,
        collected_parameters: { destination: null, check_in: null, check_out: null, guests: null },
        selected_hotel_id: null,
        current_intent: "MODIFY_SEARCH",
      });
      onHotelsFound([]);
      onNavigate("search");
      addBot("No problem! Let's start fresh. Where would you like to stay? 🏨");
      return;
    }

    if (lowerText.includes("booking") || lowerText.includes("my booking")) {
      onNavigate("bookings");
      addBot("Here are your bookings! 📋");
      return;
    }

    addBot("I'm here to help with hotel bookings! You can:\n\n• Select a hotel from the results\n• Say **\"new search\"** to search again\n• Ask **\"which is cheaper?\"** to compare\n• Say **\"budget friendly\"** or **\"under $200\"** to filter\n• Say **\"5-star only\"** for top-rated hotels");
  }

  return (
    <aside className="w-[380px] bg-card border-l border-border flex flex-col h-screen shrink-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-foreground">BookBot – AI Hotel Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-[11px] text-muted-foreground">Online – Smart Assistant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "bot" && (
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : msg.type === "summary" || msg.type === "confirmation"
                    ? "bg-primary/5 text-foreground border border-primary/15 rounded-bl-md"
                    : "bg-secondary text-foreground rounded-bl-md"
                }`}
              >
                {msg.content.split("\n").map((line, i) => (
                  <span key={i}>
                    {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={j}>{part.slice(2, -2)}</strong>
                      ) : (
                        part
                      )
                    )}
                    {i < msg.content.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Quick Suggestions - show only at start */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {quickSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="bg-primary/5 border border-primary/15 text-primary text-xs font-medium px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything…"
            className="flex-1 bg-secondary text-foreground text-sm rounded-xl px-4 py-3 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
          />
          <button
            type="submit"
            className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </form>
      </div>
    </aside>
  );
}
