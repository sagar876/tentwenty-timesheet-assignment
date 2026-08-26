# Tentwenty Timesheet Management

## Overview

A simplified SaaS-style timesheet management application built for the
Tentwenty Frontend Developer assessment. Users sign in, view their weekly
timesheets, drill into a week to see entries grouped by day, and add or edit
entries through a shared form. All data is served through internal API
routes backed by an in-memory mock data layer.

## Features

- Email/password login with dummy credentials, protected by NextAuth
- Protected dashboard and week-detail routes (redirect to `/login` when unauthenticated)
- Weekly timesheet list with Week #, Date, Status, and Actions columns
- Date-range and status filtering, with pagination (selectable page size)
- Week-detail view: entries grouped by day, with a running hours-logged progress bar
- Add and edit timesheet entries through one shared modal form
- Client-side validation (React Hook Form + Zod) and the same schema re-validated server-side
- Loading and error (with retry) states on the dashboard and week-detail views, plus an empty state on the dashboard when filters return no results
- Responsive layout (desktop, tablet, mobile)

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **Inter** (Google Font, via `next/font/google`)
- **NextAuth v5** (Credentials provider, JWT sessions)
- **shadcn/ui** (Button, Input, Label, Textarea, Badge, Table, Select, Checkbox, Dialog — built on Radix UI / Base UI)
- **React Hook Form**
- **Zod**
- **Jest** + **React Testing Library**

## Architecture

The codebase is organized by feature ownership rather than technical layer:

```
src/
├── app/          # routing + Next.js special files only (thin route entries)
├── components/   # genuinely shared UI: ui/ (shadcn primitives), layout/ (AppHeader)
├── features/     # feature-owned client code
│   ├── auth/         components/, schemas/
│   └── timesheets/   components/{dashboard,detail}/, services/, schemas/, types/, utils/
├── server/       # server-only implementation, grouped the same way
│   ├── auth/, timesheets/, projects/
├── lib/          # cross-feature infrastructure only: http.ts, utils.ts, hooks/useFetch.ts
├── auth.ts       # NextAuth v5 config (root-level, per NextAuth's own convention)
└── proxy.ts      # route protection (Next 16's renamed middleware.ts)
```

Mock data is never imported directly into React components. Every read or
write goes through the same path:

```
Component
  → feature client API function   (src/features/*/services/*.ts)
  → internal Next.js API route    (src/app/api/**/route.ts)
  → server-side service/mock data (src/server/**)
  → JSON response
  → UI
```

`src/server/**` is imported only by route handlers under `src/app/api/**`
— no component or client-side module ever reaches into it. A week's
`status` and `totalHours` are derived from its entries at request time
rather than stored, so the two can never drift out of sync.

## Authentication

- Dummy credentials against a single hardcoded mock user (see below) —
  there is no real user database.
- NextAuth v5 with the Credentials provider and a JWT session strategy (no
  database adapter).
- The session lives only in an httpOnly cookie; nothing is stored in
  `localStorage`.
- Page routes (`/dashboard`, `/timesheets/*`) are protected by `proxy.ts`
  (Next 16's renamed `middleware.ts`), which redirects unauthenticated
  requests to `/login` before the page ever renders.
- Every API route (`GET`/`POST`/`PATCH`/`DELETE`) independently checks the
  session and returns `401` if there isn't one — protection doesn't rely
  solely on the page layer.

### Mock login credentials

```
email:    john@example.com
password: password123
```

## API

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/timesheets` | Weekly summaries. Query params: `from`, `to`, `status`, `page`, `pageSize` |
| `GET` | `/api/timesheets/[weekId]` | Week detail: `{ week, entries }` |
| `POST` | `/api/timesheets/[weekId]/entries` | Create an entry |
| `PATCH` | `/api/timesheets/[weekId]/entries/[entryId]` | Update an entry |
| `DELETE` | `/api/timesheets/[weekId]/entries/[entryId]` | Delete an entry |
| `GET` | `/api/projects` | Project list, for the "Select Project" field |
| `*` | `/api/auth/[...nextauth]` | NextAuth's own handler (sign in, session, sign out) |

Responses use standard status codes: `200`/`201` on success, `204` on
delete, `400` for validation failures (with per-field messages), `401` for
unauthenticated requests, `404` for an unknown week/entry/project, `500`
for unexpected errors.

## UI

- Built from the supplied Figma screenshots as the visual source of truth —
  typography, spacing, colors, borders, and component layout were matched
  against them rather than redesigned.
- Inter is used throughout the application.
- Responsive across desktop, tablet, and mobile: the timesheet table
  scrolls horizontally within its own container below its content width
  rather than overflowing the page; filters, pagination, and entry rows
  stack vertically on narrow screens.
- Interactive primitives (dialog, select, checkbox, and the underlying
  button/input/label/table/badge/textarea building blocks) are shadcn/ui
  components, themed to the design's indigo palette rather than shadcn's
  default neutral theme.

## Getting Started

### Prerequisites

- Node.js 20.9 or later
- npm

### Installation

```bash
npm install
cp .env.example .env.local
```

### Environment variables

Only one is required, in `.env.local`:

```
AUTH_SECRET=   # generate with: openssl rand -base64 32
```

### Development

```bash
npm run dev
```

Runs at [http://localhost:3000](http://localhost:3000), which redirects to
`/dashboard` (and on to `/login` if you're not signed in).

Other scripts: `npm run build`, `npm run start`, `npm run typecheck`, `npm run lint`.

## Testing

```bash
npm run test        # run once
npm run test:watch  # watch mode
```

79 tests across 15 suites, covering: form validation and submission
(login, add/edit entry), dashboard and week-detail states (loading, error,
empty, success), and API route handlers (success, validation failure, not
found, unauthenticated mutation). Network calls are mocked at the client
service boundary; no real HTTP requests are made in tests.

## Assumptions

- **Mock data lives in memory** for the life of the server process. Creates,
  updates, and deletes persist for the current session but reset on
  restart — there is deliberately no database.
- **Timesheet weeks are a fixed mock dataset** (10 weeks spanning January
  through March 2024, Monday–Friday), not user-created. "Creating a
  timesheet" (per the assessment wording) is implemented as creating an
  entry within an existing week; a week's status changes automatically as
  entries are added, edited, or removed.
- **The dashboard's Date Range filter is a set of month presets** (matching
  the mock data's date span) rather than a calendar range picker — the
  Figma reference shows a closed dropdown with no way to tell which was
  intended.
- **A single mock user** is sufficient for the assessment's scope; there is
  no sign-up, password reset, or multi-user support.
- **"Type of work" is a fixed, small vocabulary** (Bug fixes, Feature
  development, Code review, Testing, Documentation, Meeting) rather than
  user-managed data.

## Limitations

- No persistence beyond the running server process (by design — see
  Assumptions).
- No automated end-to-end/browser test coverage — testing is unit and
  integration level (Jest + React Testing Library) only.

## Time Spent

6 hours
