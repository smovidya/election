# Election

SMO Vidya Chula election frontend (Astro) and backend (Cloudflare Workers).

## Local development

Install dependencies with `pnpm install`. Create `apps/backend/.dev.vars` with a
local `JWT_SECRET`, then initialize the local database:

```sh
pnpm --filter election-backend db:seed
pnpm dev
```

Open `http://localhost:4321` and select **Election mocks** in Astro's development
toolbar. If the toolbar is disabled, run `pnpm --filter election-frontend exec
astro preferences enable devToolbar`.

- **Test voter A/B** signs in immediately. Enter a custom 10-digit science student
  ID (ending in `23`) and name, then select **Switch user**. These are ordinary
  30-minute session tokens; eligibility and previous votes use local D1 data.
- **Sign out** removes the session and returns to the home page.
- **Before / During / After** freeze election time just before opening, at the
  midpoint, or exactly at closing. Custom time is always Bangkok time (UTC+07:00),
  regardless of the computer's timezone. **Use real time** clears the override.

Changes reload the page. Frozen time persists across navigation in the same tab.
The countdown, backend voting checks, results time checks, and ballot/voter
timestamps use the same time. OAuth and session expiry continue using real time.
Results still require `isResultAnnounced` in `packages/constants/src/event.ts`.

The toolbar runs only under `astro dev`. The backend accepts development login
and time headers only when `ENVIRONMENT=dev`; staging and production disable both.
Wrangler uses local D1/KV by default. Changing users does not erase votes.

## API and tests

In development, `POST /auth/dev-login` accepts `{ studentId, studentName }` and
returns `{ jwtSessionToken }`. Send that token as `Authorization: Bearer …`.
An independent `X-Dev-Time` header accepts an ISO timestamp with seconds and an
explicit timezone, such as `2026-10-05T12:00:00+07:00`. Missing or invalid values
fall back to the clock. This replaces the old Basic-auth time override.

Tests can pass `now: () => new Date(...)` to `createApp` without changing the
system clock. Run the Worker integration tests with:

```sh
pnpm --filter election-backend test
```

The tests use an isolated local database and cover sessions, user switching,
voting boundaries, ballot timestamps, duplicate voting, and production gates.
