# SYSTEM_RECOVERY_PROTOCOL

> A cyberpunk-themed real-time system diagnostics and service management dashboard — built with React, Express, and PostgreSQL.

---

## Overview

**SystemRecovery** is a full-stack web application that visualises and manages running system services through an immersive cyberpunk interface. Services are stored in a PostgreSQL database and exposed via a REST API. The frontend renders animated service cards with live status indicators, a recovery simulation engine, and a full CRUD management panel.

---

## Features

- **Live Service Grid** — 18 services rendered as animated cards with status badges (Stable, Warning, Critical, Recovering, Scanning)
- **Recovery Simulation** — animated scan-and-repair sequence with a real-time progress bar; persists all statuses to the database on completion
- **Full CRUD Management** — deploy new services, configure existing ones (name, size, status, icon), and terminate services — all via a manage-mode overlay
- **One-Click Reset** — restores the entire service list to factory seed state in the database
- **Cyberpunk UI** — neon cyan/amber/red colour palette, JetBrains Mono font, scanline overlays, corner bracket decorations, and framer-motion animations
- **Type-Safe API** — shared Zod schemas between frontend and backend for end-to-end type safety
- **Zero-Config Database** — auto-seeds 18 services on first boot if the table is empty

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Animations | Framer Motion |
| State / Data | TanStack Query v5 |
| Routing | Wouter |
| Backend | Node.js, Express |
| Database | PostgreSQL 16 |
| ORM | Drizzle ORM + drizzle-zod |
| Icons | Lucide React |
| Fonts | JetBrains Mono, Oxanium, Rajdhani (Google Fonts) |

---

## Project Structure

```
.
├── client/
│   └── src/
│       ├── components/
│       │   ├── CyberCard.tsx        # Animated card with corner brackets
│       │   ├── StatusBadge.tsx      # Status indicator badge
│       │   └── ui/                  # shadcn/ui component library
│       ├── hooks/
│       │   └── use-services.ts      # All TanStack Query hooks (CRUD + recover)
│       ├── lib/
│       │   └── queryClient.ts       # Configured QueryClient + apiRequest
│       ├── pages/
│       │   └── SystemRecovery.tsx   # Main dashboard + management UI
│       ├── App.tsx                  # Router
│       ├── index.css                # Cyberpunk theme variables + fonts
│       └── main.tsx
├── server/
│   ├── db.ts                        # Drizzle + pg Pool connection
│   ├── index.ts                     # Express entry point
│   ├── routes.ts                    # Route handlers (CRUD + reset + recover)
│   ├── storage.ts                   # DatabaseStorage class + SEED_DATA
│   └── vite.ts                      # Vite dev server integration
├── shared/
│   ├── schema.ts                    # Drizzle table schema + Zod types
│   └── routes.ts                    # API contract (paths, methods, schemas)
└── README.md
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/services` | List all services ordered by ID |
| `POST` | `/api/services` | Create a new service |
| `PATCH` | `/api/services/:id` | Update a service (any fields) |
| `DELETE` | `/api/services/:id` | Delete a service |
| `POST` | `/api/services/reset` | Wipe and re-seed all services to defaults |
| `POST` | `/api/services/recover` | Set all non-stable services to stable |

### Service Schema

```json
{
  "id": 1,
  "name": "Documents & Sync",
  "size": "9.82 MB",
  "status": "warning",
  "icon": "Cloud"
}
```

**Status values:** `stable` · `warning` · `critical` · `recovering` · `scanning`

**Available icons:** `Cloud` · `Lock` · `Smartphone` · `Database` · `Bluetooth` · `Activity` · `Music` · `Zap` · `Eye` · `Wifi` · `Server` · `Home` · `Users` · `LayoutGrid` · `Cpu` · `Shield` · `Terminal` · `CheckCircle2`

---

## Database Schema

```sql
CREATE TABLE system_services (
  id     SERIAL PRIMARY KEY,
  name   TEXT NOT NULL,
  size   TEXT NOT NULL,
  status TEXT NOT NULL,
  icon   TEXT NOT NULL
);
```

Managed via Drizzle ORM. Auto-seeds 18 services on first boot.

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16

### Setup

```bash
# Install dependencies
npm install

# Push the database schema
npm run db:push

# Start the development server
npm run dev
```

The app runs on **http://localhost:5000** — Express serves both the API and the Vite frontend on the same port.

### Build for Production

```bash
npm run build
node dist/index.cjs
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Server port (default: `5000`) |
| `NODE_ENV` | `development` or `production` |

---

## Theme Reference

All colours are defined as CSS variables in `client/src/index.css`:

| Variable | Value | Usage |
|---|---|---|
| `--primary` | `180 100% 50%` | Cyan neon — stable, active |
| `--accent` | `45 100% 60%` | Amber — warnings |
| `--destructive` | `0 100% 60%` | Red — critical errors |
| `--status-stable` | `150 100% 45%` | Green status badge |
| `--status-warning` | `45 100% 50%` | Amber status badge |
| `--status-critical` | `0 100% 60%` | Red status badge |
| `--status-recovering` | `180 100% 50%` | Cyan status badge |
| `--status-scanning` | `280 100% 60%` | Purple status badge |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build client + server for production |
| `npm run start` | Run production build |
| `npm run db:push` | Sync Drizzle schema to database |
| `npm run check` | TypeScript type check |

---

## License

MIT
