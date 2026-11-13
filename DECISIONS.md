# Decisions

- Database migrations are additive and RLS-only, because the live Supabase schema must retain teammate and legacy data.
- The same ten challenge IDs are used across all language tracks; language-specific starter code and tests remain in frontend content.
- `skill_node_challenges` maps shared challenge IDs to language-specific nodes, since one `challenges.node_id` cannot represent all three language towns.
- C++ execution is implemented as a clear backend capability check until a configured isolated runner endpoint is supplied; progress works when the browser reports passed tests.
- The backend accepts the legacy `SUPABASE_SERVICE_KEY` or the current `SUPABASE_SECRET_KEY`, keeping either secret server-only.
