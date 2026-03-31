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

## Security Audit — Cleared

Last audit: **March 31, 2026**

| Scanner | Result |
|---|---|
| Dependency vulnerabilities | **0** (all 14 findings patched) |
| Static code analysis (SAST) | **0 findings** |
| Secrets / data-flow scan | **0 findings** |

All dependency patches applied. No major version changes were required.

---

## GitHub Backdating — How It Works & How to Detect It

This section documents a known scam technique used to falsely claim authorship or prior art on GitHub repositories. It is included here to protect the intellectual property of this project and to inform legitimate reviewers of what to look for.

---

### What Is Git Backdating?

Git allows any user to set **arbitrary timestamps** on commits before pushing them to a remote repository. This means a bad actor can create a commit today but make it appear as if it was written months or years ago. GitHub displays these falsified dates as if they were real, with no warning.

**There are two timestamps on every git commit:**

| Timestamp | What it is | Can it be faked? |
|---|---|---|
| `AuthorDate` | When the commit was supposedly written | **Yes — trivially** |
| `CommitDate` | When the commit was recorded in the tree | **Yes — trivially** |
| GitHub push time | When the push was received by GitHub's servers | **No — set by GitHub** |

Both author and commit dates can be set to any value using:

```bash
git commit --date="2020-01-01T00:00:00" -m "Fake early commit"
# or via environment variables:
GIT_AUTHOR_DATE="2020-01-01T00:00:00" GIT_COMMITTER_DATE="2020-01-01T00:00:00" git commit -m "Fake"
```

---

### How to Detect Backdated Commits

#### Method 1 — Check the raw git log with full timestamps

```bash
git log --format="%H %ai %ci %s" --all
```

- `%ai` = Author date (ISO format) — **can be faked**
- `%ci` = Commit date (ISO format) — **can be faked**
- Compare these against known push dates from the GitHub API

#### Method 2 — Check GitHub's push event log via API

GitHub records the **actual server-side push time** via its Events API. This cannot be altered by the repository owner:

```bash
curl https://api.github.com/repos/OWNER/REPO/events
```

Look for `PushEvent` entries. The `created_at` field is set by GitHub servers — if a commit claims to be from 2020 but the push event timestamp is 2026, the commit date was faked.

#### Method 3 — Look for impossible metadata patterns

Signs of backdating in a repository:

| Red flag | Explanation |
|---|---|
| Commits dated before the repository was created | GitHub records repository creation — commits cannot legitimately pre-date it |
| All early commits pushed in a single batch | Genuine long-running projects have irregular push patterns |
| `AuthorDate` and `CommitDate` are identical down to the second on every commit | Real development has variation; scripted backdating is uniform |
| No matching Issues, PRs, or Wiki edits from the claimed period | Real active projects leave a broader activity trail |
| File contents reference libraries, APIs, or tools released after the commit date | Code cannot use technology that did not exist yet |

#### Method 4 — Inspect the reflog (if you have access)

```bash
git reflog show --date=iso origin/main
```

The reflog records when references were actually updated locally. On a cloned copy, this reveals when the branch was last fetched — inconsistent with claimed history.

#### Method 5 — Cross-reference with the Wayback Machine

Search `https://web.archive.org/web/*/github.com/OWNER/REPO` — if the repository did not exist in web archives from the claimed period, the early commits are fabricated.

---

### Adding a LOL File (Evidence of Fabrication)

A common pattern in backdating scams is inserting a small placeholder file — sometimes literally named `lol`, `test`, or similar — into the faked early history. This is done to create the appearance of activity at a specific date. The file content is meaningless; its only purpose is to create a commit with a false timestamp.

**How to spot it:**

```bash
# List all files added in the first 5 commits
git log --diff-filter=A --name-only --format="" | head -20

# Check if any files were added with suspiciously round timestamps
git log --format="%ai %H" --diff-filter=A -- lol* test* temp* placeholder*
```

If files appear with perfectly round timestamps (e.g., exactly midnight, exactly the start of a month) and no meaningful content, this is consistent with scripted backdating rather than genuine development.

---

### Protecting Your Own Work

To establish verifiable proof of authorship that cannot be faked:

1. **Publish to a timestamped registry** — npm, PyPI, or any public package registry records server-side publish times that cannot be altered.
2. **Use signed commits** — GPG or SSH commit signing ties commits to a cryptographic key with a certificate timestamp.
3. **Archive with a third party** — Services like Software Heritage (`https://archive.softwareheritage.org`) crawl and timestamp public repositories independently.
4. **Document push dates** — GitHub's Events API provides tamper-evident push timestamps. Save these.
5. **Use a notarisation service** — Timestamping authorities (RFC 3161) provide legally admissible proof of when a document existed.

---

## License & Legal

**PROPRIETARY — ALL RIGHTS RESERVED**

Copyright © 2026. All rights reserved.

This software and its source code are the exclusive intellectual property of the owner. Access to this repository or codebase is granted solely for authorised review purposes under a Non-Disclosure Agreement (NDA).

**The following are strictly prohibited without prior written consent from the owner:**

- Copying, reproducing, or duplicating any part of this codebase
- Forking, cloning, or branching this repository
- Distributing, publishing, or sharing this software or any derivative work
- Using any part of this code in another project, commercial or otherwise
- Reverse engineering, decompiling, or disassembling the software

**By accessing this codebase you agree that:**

- You are bound by the terms of a signed Non-Disclosure Agreement (NDA)
- Any unauthorised use, disclosure, or reproduction may result in legal action
- This software contains confidential and proprietary trade secrets

For licensing enquiries or authorised use requests, contact the owner directly.

> **CONFIDENTIAL — NOT FOR PUBLIC DISTRIBUTION**
