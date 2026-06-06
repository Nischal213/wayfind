# Wayfind

> An interactive graph visualization platform for real-time node-edge modeling and optimal pathfinding analysis.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Roadmap](#roadmap)

---

## Overview

Wayfind bridges the gap between theoretical computer science and modern full-stack development — implementing complex graph algorithms within a highly responsive, user-facing web interface.

A key technical achievement is its **"zero-latency" persistence layer**: graph states (nodes and edges) are automatically and continuously synchronized with the backend, eliminating the need for manual saving and ensuring strict data integrity across sessions.

---

## Features

- 🗺️ **Interactive Graph Canvas** — Drag, drop, and connect nodes in real time using React Flow
- ⚡ **Zero-Latency Persistence** — Automatic state sync with Supabase; no manual saving required
- 🔍 **Optimal Pathfinding** — Production-ready pathfinding engine built into the core architecture
- 🤖 **AI Insights** — Powered by Google Gemini for intelligent graph analysis
- 🔐 **Authentication** — Secure user accounts via Clerk

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (React) |
| Graph Visualization | [React Flow](https://reactflow.dev/) (`@xyflow/react`) |
| Authentication | [Clerk](https://clerk.com/) |
| Database & Persistence | [Supabase](https://supabase.com/) (PostgreSQL) |
| AI Insights | [Google Gemini API](https://ai.google.dev/) (`@google/genai`) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (with NPM or Bun)
- Active accounts and API keys for the following services:
  - [Google Gemini](https://aistudio.google.com/app/apikey) — obtainable via Google AI Studio
  - [Clerk](https://dashboard.clerk.com/) — obtainable via the Clerk Dashboard
  - [Supabase](https://supabase.com/dashboard/) — obtainable via the Supabase Dashboard

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Nischal213/wayfind.git
   cd wayfind
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables** — see the [Environment Variables](#environment-variables) section below.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

---

### Environment Variables

Create a `.env.local` file in the root directory and populate it with your credentials. Direct links to each service's key page are included as comments.

```env
# ─── Clerk Auth ────────────────────────────────────────────────────────────────
# Keys found at: https://dashboard.clerk.com/ → Your App → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# ─── Supabase ──────────────────────────────────────────────────────────────────
# Keys found at: https://supabase.com/dashboard/ → Your Project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ─── Google Gemini ─────────────────────────────────────────────────────────────
# Keys found at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key
```

---

## Roadmap

**Status:** Core architecture and pathfinding engine are complete and production-ready.

| Feature | Status |
|---|---|
| Core graph engine & pathfinding | ✅ Complete |
| Zero-latency Supabase persistence | ✅ Complete |
| Stripe integration for tiered billing | 🔜 Planned |
| Real-time multi-user collaboration via WebSockets | 🔜 Planned |
| Minimum Spanning Tree (MST) analysis | 🔜 Planned |

---

*Developed and maintained by [Nischal213](https://github.com/Nischal213)*