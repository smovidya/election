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

Staging builds use `APP_ENV=staging` from `apps/frontend/.env.staging` and display
a yellow testing banner on every page, plus a testing label in shared receipts.
Voting is available before and after the election window on staging only.
Google login, 30-minute session expiry, eligibility, and one vote per student
still apply. Results keep their normal announcement restrictions. Production
builds use `APP_ENV=production` and retain the voting window. Frontend environment
flags are set during the Astro build, not from Wrangler runtime variables.

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

## Production deployment

Use Cloudflare account `e2069f9cc14d2fe64afc9d04ed6576bd`. Production has its own
KV namespace; staging retains its existing namespace. Apply `db:seed:production`
before deploying backend changes: it creates missing schema and the
`ballots_record_voter` trigger without deleting existing votes.

Vote submission uses one guarded SQL statement, with eligibility materialized
before inserting ballots. The trigger records participation within that same
statement. Concurrent duplicate submissions return `voted-already`; a failed
ballot rolls back all ballots and participation. Keep the trigger installed when
rolling back code; it is compatible with the previous writer.

```sh
export CLOUDFLARE_ACCOUNT_ID=e2069f9cc14d2fe64afc9d04ed6576bd
pnpm --filter election-backend db:seed:production
pnpm --filter election-backend deploy:production
pnpm --filter election-frontend deploy:production
```

A first backend deployment requires a separate production `JWT_SECRET` Worker
secret. The frontend deployment script builds in production mode before upload.
The production URLs are `https://election.vidyachula.org` and
`https://election-api.vidyachula.org`. Verify Google allows the JavaScript origin
`https://election.vidyachula.org` and, for the redirect flow,
`https://election.vidyachula.org/login`.

The confirmed voting window is October 5, 2026, 07:00–17:00 Bangkok time;
results stay hidden until `isResultAnnounced` is enabled and the window has closed.
The integration tests also cover simultaneous submissions and statement rollback.
