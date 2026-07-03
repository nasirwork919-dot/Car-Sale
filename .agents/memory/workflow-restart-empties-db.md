---
name: Workflow restart can empty the dev database
description: Restarting the "Start application" workflow in this environment can reset/empty the PostgreSQL dev database; re-seed and re-verify auth tokens before resuming any testing after a restart.
---

After restarting a workflow (e.g. to pick up a schema change or recover from a backend crash), previously seeded data can disappear even though `_prisma_migrations`/schema state is untouched. Symptoms: login suddenly returns "Invalid email or password" for users that worked moments earlier, or `SELECT count(*) FROM users` returns 0.

**Why:** The dev Postgres instance's lifecycle appears tied to the workflow/container lifecycle in some cases, so a restart can wipe rows even when no migration or destructive SQL was run.

**How to apply:** After any workflow restart, always re-run the project's seed script (e.g. `npm run prisma:seed`) and re-fetch fresh auth tokens before continuing manual/curl testing — don't assume previously-created data or cached tokens are still valid.

Separately: an unhandled error in one process of a multi-process workflow (e.g. a Prisma validation error thrown in the backend Express process under `concurrently`) can crash the *entire* workflow, not just that process — always check workflow status after triggering an unexpected server error, and restart if needed.
