# Tentwenty Timesheet Management

## 1. What is this project?

This is a Timesheet Management web app, built for the Tentwenty frontend
developer assessment.

A user logs in, sees a list of their weekly timesheets, and can open any
week to see the individual entries for that week, grouped by day. From
there they can add, edit, or delete entries.

Main features:

- Login (with a dummy test account)
- Dashboard with a list of weekly timesheets
- Sorting the timesheet list
- Filtering by date range and status
- Opening a week to see its details
- Adding, editing, and deleting entries
- Form validation (with clear error messages)
- Loading and error states
- A layout that works on desktop, tablet, and mobile

All the data in this app is fake ("mock data"). There is no real
database — see [Assumptions](#7-assumptions) below for why.

## 2. Technologies used

This list only includes packages that are actually used in the project
(checked against `package.json`).

- **Next.js** — the framework. Used for the pages and the internal API
  routes.
- **React** — used to build the UI.
- **TypeScript** — used everywhere for type safety.
- **Tailwind CSS** — used for styling.
- **shadcn/ui** — used for reusable UI parts like buttons, dialogs,
  dropdowns, and inputs. These are built on top of Radix UI.
- **NextAuth (Auth.js)** — used for login and sessions.
- **React Hook Form** — used to manage form state.
- **Zod** — used to define validation rules for forms and API input.
- **Jest** and **React Testing Library** — used for tests.

## 3. Features

- A user can log in using the dummy account (see [How to run the
  project](#6-how-to-run-the-project) for the credentials).
- Once logged in, a user sees a list of their weekly timesheets, with a
  status for each one: Completed, Incomplete, or Missing.
- A user can sort the list by Week #, Date, or Status. Clicking a column
  header again reverses the sort order.
- A user can filter the list by an arbitrary start/end date range (native
  date pickers) and by status.
- A user can open a week to see its entries, grouped by day, with a
  progress bar showing hours logged out of 40.
- A user can add a new entry to any day in the week.
- A user can edit or delete an existing entry from a small menu on the
  entry (the three-dot menu).
- Deleting an entry asks for confirmation first.
- If a form is submitted with missing or invalid fields (for example, no
  project selected, or hours outside 0.25–24), the form shows an error
  message under each field and does not submit.
- Hours accept decimals in quarter-hour steps (0.25), from 0.25 to 24
  per entry — e.g. 7.5 or 2.25 are valid.
- "Remember me" on login persists the session across browser restarts
  when checked (and expires with the browser session when unchecked),
  and separately remembers the email address for next time — the
  password is never stored.
- Pagination, sorting, the status/date filters, and the Add/Edit modal
  are all reflected in the URL. Refreshing, sharing a link, or using
  the browser's Back/Forward buttons all restore the same view.
- The pagination control shows a windowed page range with an ellipsis
  once there are more pages than fit on screen, instead of listing
  every page number.
- While data is loading, the dashboard shows a skeleton/shimmer table;
  the week-detail view shows a loading message. If a request fails,
  the page shows an error message with a button to try again.
- The layout adjusts for smaller screens — the table scrolls sideways
  instead of breaking the page, and filters/rows stack vertically.

## 4. Project structure

Here's a simple explanation of the main folders inside `src/`.

### `app`

This is where Next.js expects pages and API routes to live. Every file
named `page.tsx` is a page you can visit in the browser, and every file
named `route.ts` under `app/api` is a backend endpoint.

The page files themselves are kept short — they mostly just render a
component from `features/`. The actual page logic lives there, not in
`app/`.

### `components`

Components that are genuinely used in more than one place and don't
belong to a specific feature. Right now this is just `AppHeader`, the
top navigation bar shown on every page.

### `components/ui`

Reusable shadcn UI components, like `Button`, `Dialog`, `DropdownMenu`,
`Select`, `Table`, and `Tooltip`. These aren't specific to timesheets —
they're generic building blocks used all over the app.

### `features`

Code that belongs to one specific feature. There are two features:
`auth` and `timesheets`.

For example, everything related to timesheets — the dashboard table, the
detail view, the add/edit form, the API calls, and the validation rules
— lives inside `features/timesheets`. If you're working on timesheets,
this is the one folder you need to open.

### `server`

Code that should only ever run on the server — never in the browser.
This is where the mock data lives (`mockWeeks.ts`, `mockEntries.ts`,
`mockProjects.ts`, `mockUsers.ts` — the `mock` prefix marks the files
that would be swapped out first if this were ever backed by a real
database), along with the service functions that read and update it.
Nothing outside of `server/` is allowed to import the mock data files
directly (see the next section for why).

### `hooks`

Currently holds just `useFetch`, the small data-fetching hook used by
both the dashboard and the week-detail view.

### `lib`

Small non-React pieces of code shared across the whole app: a helper
for reading API responses, a helper for building/updating URL search
params, a helper used by shadcn components for combining CSS classes,
and the localStorage helper behind "remember my email" on login.

## 5. How the API works

The UI never reads mock data directly. Every piece of data goes through
the same path:

```
UI component
  → a function in features/*/services (e.g. timesheetsApi.ts)
  → an internal API route (app/api/**/route.ts)
  → a server-side service (server/**)
  → the mock data
  → a JSON response
  → back to the UI
```

So if a component needs data, it calls a function like
`getWeeklyTimesheets()`. That function does a normal `fetch()` call to
one of our own API routes, for example `/api/timesheets`. That route:

1. Checks that the user is logged in (returns `401` if not).
2. If it's a `POST` or `PATCH` request, validates the request body using
   the same Zod schema the form used on the client (returns `400` with
   the field errors if it's invalid).
3. Calls a function in `server/` to read or update the mock data.
4. Sends back a JSON response.

This means the mock data could be swapped for a real database later
without changing anything in `features/` or `components/` — only the
`server/` folder would need to change.

## 6. How to run the project

### Prerequisites

- Node.js 20.9 or later
- npm

### Install dependencies

```bash
npm install
```

### Set up environment variables

Copy the example file and fill it in:

```bash
cp .env.example .env.local
```

Only one value is needed — a secret NextAuth uses to sign the login
session:

```
AUTH_SECRET=   # generate one with: openssl rand -base64 32
```

### Run the app

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). It will
redirect you to `/dashboard`, and to `/login` if you're not signed in
yet.

**Test login:**

```
email:    john@example.com
password: password123
```

A second mock account also exists (`sagar@example.com` / `password1234`), useful for checking that "Remember me" and the remembered-email behavior are per-account rather than hardcoded to one user.

### Other useful commands

```bash
npm run build      # production build
npm run start       # run the production build
npm run lint         # check code style
npm run typecheck  # check TypeScript types
npm run test         # run all unit/component tests once
npm run test:watch  # run unit/component tests in watch mode
npm run test:e2e     # run the Playwright end-to-end tests (starts the dev server automatically)
```

## 7. Assumptions

Some decisions were made to keep the project focused on the assessment,
rather than building a full production system:

- **Mock data lives in memory**, not in a database. Any timesheet you
  add, edit, or delete will look correct while the app is running, but
  it resets the moment the server restarts.
- **The list of weeks is fixed** — 50 weeks from January to December
  2024, Monday to Friday. Users don't create new weeks; "creating a
  timesheet" means adding an entry to an existing week, and that week's
  status updates automatically based on its total hours. (Weeks were
  expanded from an initial 10 to 50 specifically so pagination has
  enough real data to page through.)
- **There are two test users**, both hardcoded — no sign-up flow,
  password reset, or real account management.
- **A timesheet week cannot exceed 40 hours.** This is enforced in
  `timesheetService.ts` (not just the UI), so it can't be bypassed by
  calling the API directly. Editing an entry correctly excludes its own
  old hours before checking the new total against the limit.
- **"Type of work" is a fixed list** (Bug fixes, Feature development,
  Code review, Testing, Documentation, Meeting), picked from a
  dropdown rather than typed freely. In a real backend this list would
  come from an API rather than being hardcoded client-side, but the
  dropdown UI is intentional either way.

### Known limitations

- No real database — see above.
- Most testing is at the unit and component level (Jest + React
  Testing Library) — 162 tests across 21 test files, covering form
  validation, loading/error/empty states, URL state
  (pagination/sorting/filtering/deep-linking), the 40-hour weekly cap,
  and the API routes themselves. Tests sit beside the file they cover;
  a local `__tests__/` folder is used where a directory has several
  related test files (e.g. `features/timesheets/utils/__tests__/`).
- A small Playwright end-to-end suite (`tests/e2e/`) covers the
  critical real-browser flow that unit tests can't: login → dashboard
  → open a week → add/edit/delete an entry → totals and status
  updating → the 40-hour rule rejecting an over-limit entry → the
  Remember Me session cookie's actual expiry when checked. It's
  intentionally small — it doesn't duplicate the detailed validation
  already covered by the Jest suite.


## Future Improvements for state management

The current implementation intentionally keeps the state management simple for the scope of this assessment.

If the application grows, the following could be considered:

- **TanStack Query** for server-state management, caching, background refetching, and request synchronization.
- **Redux Toolkit** if the application develops more complex shared client-side state across multiple features.
- More comprehensive end-to-end testing for critical user flows.
- Additional accessibility and cross-browser testing.

## Time spent

About 6-7 hours.
