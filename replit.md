# SystemRecovery — Cyberpunk Diagnostics Dashboard

A full-stack system diagnostics dashboard with a cyberpunk aesthetic, animated service status indicators, and a PostgreSQL backend.

## Architecture

**Stack:** Express + Vite (single port 5000), React 18, TypeScript, Drizzle ORM, PostgreSQL

```
client/src/
  pages/SystemRecovery.tsx   # Main dashboard page
  components/CyberCard.tsx   # Animated card wrapper (framer-motion)
  components/StatusBadge.tsx # Status indicator badges
  hooks/use-services.ts      # TanStack Query hooks for API
  lib/utils.ts               # cn() utility (clsx + tailwind-merge)
  index.css                  # Cyberpunk theme variables + fonts

server/
  index.ts                   # Express entry point
  routes.ts                  # API route handlers
  storage.ts                 # DatabaseStorage class + seeding
  db.ts                      # Drizzle + pg Pool

shared/
  schema.ts                  # systemServices table + Zod types
  routes.ts                  # API contract (paths, methods, response schemas)
```

## Database

- Table: `system_services` (id serial PK, name, size, status, icon)
- 18 services seeded on first boot (only if table is empty)
- Status values: `stable | warning | critical | recovering | scanning`
- Icons stored as strings, mapped to Lucide components on the frontend

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/services` | Returns all 18 services ordered by id |
| POST | `/api/services/reset` | Returns current DB state (used to reset simulation) |

## Theme

Cyberpunk dark mode — defined in `client/src/index.css` as CSS variables:
- Primary: cyan neon (`180 100% 50%`)
- Accent: amber warning (`45 100% 60%`)
- Destructive: red critical (`0 100% 60%`)
- Fonts: JetBrains Mono (mono), Oxanium (display), Rajdhani (body)
- Custom status color variables: `--status-stable/warning/critical/recovering/scanning`

## Running

| Mode | Command |
|------|---------|
| Development | `npm run dev` (Vite HMR + tsx server) |
| Build | `npm run build` (esbuild server + Vite client) |
| Production | `node dist/index.cjs` |
| DB schema push | `npm run db:push` |

## Key Dependencies

- `framer-motion` — card entrance animations, progress bar, scanning pulse
- `lucide-react` — icon components (mapped by string name from DB)
- `@tanstack/react-query` v5 — data fetching with cache invalidation
- `drizzle-orm` + `drizzle-zod` — type-safe DB queries and validation
- `wouter` — client-side routing
