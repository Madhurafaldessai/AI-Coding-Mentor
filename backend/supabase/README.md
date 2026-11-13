# Supabase setup

Run `migrations/001_additive_learning_schema.sql`, then `002_seed_learning_content.sql`, in that order in the Supabase SQL Editor. Both are additive and safe to rerun.

The backend uses `SUPABASE_SERVICE_KEY` only. For the frontend, set only:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Never put the service-role key in a frontend environment file.
