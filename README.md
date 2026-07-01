# HotelMind

An intelligent hotel booking dashboard with a built-in chat assistant ("BookBot") that helps users search, compare, and book hotels through natural conversation.

## Features

- **Conversational booking flow** — BookBot walks users through destination, dates, and guest count via slot-filling, then surfaces matching hotels
- **Rule-based smart filtering** — chat understands phrases like "under $200", "budget", "5-star", "near pool", "boutique", "resort", etc. and filters results live
- **Hotel comparison & sorting** — ask "which is cheapest?", "most luxurious?", or "compare" to get instant rankings
- **Dashboard overview** — total bookings, active reservations, and amount spent at a glance
- **Booking management** — confirm, view, and cancel bookings, with chat confirmations posted back into the conversation
- **Saved hotels & offers** — dedicated panels for favorites and deals (offers/reports/support/account are placeholder panels ready to be built out)
- **Polished UI** — sidebar navigation, animated chat panel (Framer Motion), shadcn-ui + Tailwind CSS

## Tech Stack

- [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/) + React Router
- [shadcn-ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) for chat animations
- [TanStack Query](https://tanstack.com/query)
- [Vitest](https://vitest.dev/) + Testing Library

## Getting Started

**Requirements:** Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Navigate to the project directory
cd hotel-concierge-ai

# 3. Install dependencies
npm i

# 4. Start the dev server
npm run dev
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build |
| `npm run build:dev` | Development-mode build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run tests once (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── components/
|
│   ├── NavLink.tsx
│   ├── dashboard/
│   │   ├── Sidebar.tsx           # Main nav (Home, Search, Bookings, Saved, Offers, Reports, Support...)
│   │   ├── ChatPanel.tsx         # BookBot — rule-based conversational assistant
│   │   ├── DashboardPanel.tsx    # Home overview with stats & quick actions
│   │   ├── HotelResults.tsx      # Search results grid
│   │   ├── HotelCard.tsx         # Individual hotel card
│   │   ├── HotelDetail.tsx       # Hotel detail / booking view
│   │   ├── BookingsPanel.tsx     # View & cancel bookings
│   │   ├── SavedHotelsPanel.tsx  # Saved/favorited hotels
│   │   └── PlaceholderPanel.tsx  # Stub for Offers/Reports/Support/Account/Settings
│   └── ui/                       # shadcn-ui components
├── data/hotels.ts                # Static hotel dataset + search helper
├── types/booking.ts              # SessionState, ChatMessage, Booking types
├── pages/
│   ├── Index.tsx                 # Main dashboard layout & state orchestration
│   └── NotFound.tsx
├── hooks/, lib/
└── test/                         # Vitest setup + example test

```

## How BookBot Works

BookBot is currently a **rule-based assistant** (pattern matching on keywords/regex in `ChatPanel.tsx`), not an LLM. It:

1. Detects filter intents (price, star rating, amenities, hotel type) and narrows the static hotel list in `data/hotels.ts`
2. Detects question intents (cheapest/most expensive/compare/cancellation policy) and responds directly
3. Falls back to slot-filling: destination → check-in/check-out dates → guest count → search results

All hotel data, bookings, and session state are held in-memory (React state) — nothing persists across a page refresh yet.

## Configuration Notes

- **No backend/database yet**: hotels are hardcoded in `src/data/hotels.ts`, and bookings live only in component state. Wire this up to a database (e.g. Supabase, Postgres) for persistence.
- **No real AI integration**: BookBot's "intelligence" is regex/keyword matching. To make it genuinely conversational, replace `processInput` in `ChatPanel.tsx` with a call to an LLM API (OpenAI, Claude, etc.), passing the current `SessionState` as context so it can still track destination/dates/guests.
- **Date parsing is naive**: the regex in `processInput` assumes fairly specific date formats (e.g. "June 10 - June 13, 2026") and may mis-parse other formats.

## Roadmap Ideas

- [ ] Replace rule-based BookBot with a real LLM-backed assistant
- [ ] Persist hotels, bookings, and saved hotels to a real database
- [ ] Build out Offers, Reports, Support, Account, and Settings panels
- [ ] Add user authentication
- [ ] Add payment flow for booking confirmation

## Deployment

Build with `npm run build` and deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages, etc).
