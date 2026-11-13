# Progress

## Database phase

- Added additive, transactional Supabase schema and metadata seed migrations under `backend/supabase/migrations/`.
- No SQL has been run against Supabase. Run the two files in order, then report back so `npm run db:check` can verify the live schema.
- Added `npm run db:check --workspace=@mentor/backend`; it verifies required tables and columns through the service-role REST client without logging credentials.
- Backend auth/account/track scaffolding is in progress. Frontend and completion processing remain pending.

## Backend phase

- Added service-role-only Supabase client, bearer-token authentication, profile bootstrap, username, language, track, dashboard, attempt, completion, and mentor-cost endpoint plumbing.
- Backend TypeScript build passed after these changes.
- The frontend lint baseline currently fails on five pre-existing React-effect/CommonJS lint errors; it is recorded for remediation before final QA.

## Frontend foundation

- Added a public-key-only Supabase browser client, persistent auth provider, and `/auth` password sign-up/login page. The Google button is intentionally absent.
- Added public Supabase placeholder variables to `frontend/.env.example`.

## Verification

- `npm run build --workspace=@mentor/backend` passes.
- `npm run lint --workspace=@mentor/frontend` completes with six pre-existing warnings and no errors.
- `npx tsc --noEmit -p frontend/tsconfig.json` passes.
- `npm run build --workspace=@mentor/frontend` is blocked in this sandbox by Turbopack attempting to bind a port (`Operation not permitted`), before application type/build diagnostics are produced.
- `db:check` cannot run through `tsx` in this sandbox because it is forbidden from creating its IPC socket. The compiled check reached the Supabase network call but exceeded the 30-second sandbox window; run the documented command locally to get the definitive result.
- Migration destructive-statement scan found no `DROP`, `TRUNCATE`, `DELETE FROM`, or `ALTER COLUMN` statements.
- Fixed the legacy `challenges.category NOT NULL` omission in `002_seed_learning_content.sql`. The same file now seeds four test cases plus Python, JavaScript, and C++ reference solutions for all seven new challenges.
- Executed the seven new Python and JavaScript solutions against four cases each: 56/56 passed.

## Remaining work

- Complete database transaction/idempotency and streak/badge logic, C++ runner integration, SSR cookie middleware, onboarding/dashboard/town pages, and workspace persistence integration.
- Run database-backed and browser QA after the migrations are executed.

## Suggested commits

- `feat(db): add additive learning progression schema and seeds`
