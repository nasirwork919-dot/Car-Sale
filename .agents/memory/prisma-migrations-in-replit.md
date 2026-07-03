---
name: Prisma migrations in Replit (non-interactive environment)
description: prisma migrate dev fails as non-interactive in this sandbox; use a manual diff+apply workflow instead, and know how to repair a corrupted _prisma_migrations table.
---

`prisma migrate dev` refuses to run here with "Prisma Migrate has detected that the environment is non-interactive, which is not supported" — this happens even with `CI=true` set, because the sandbox has no real TTY at all (not just a CI-style non-interactive shell).

**Workaround for adding a new migration:**
1. Create the new migration folder manually: `mkdir server/prisma/migrations/<timestamp>_<name>`
2. Generate the SQL diff: `npx prisma migrate diff --from-migrations server/prisma/migrations --to-schema-datamodel server/prisma/schema.prisma --shadow-database-url "$DATABASE_URL" --script > server/prisma/migrations/<timestamp>_<name>/migration.sql`
3. Apply it directly against the real database with `psql "$DATABASE_URL" -f <path>/migration.sql` — do NOT rely on `prisma migrate resolve --applied` to also execute the SQL; that command only marks the migration row as applied in `_prisma_migrations`, it does not run anything.
4. Run `npx prisma migrate status` to confirm "Database schema is up to date!"

**Why:** `prisma migrate dev` is the only command that both writes migration files and runs them, but it's interactive-only. Splitting diff-generation and application avoids that gate.

**If `_prisma_migrations` ends up corrupted** (e.g. a migration row has `finished_at = NULL` from a failed apply, or an earlier migration is missing its row entirely even though its SQL was already applied to the DB by some earlier process): compare the live DB schema (`psql "$DATABASE_URL" -c '\d tablename'`) against what each migration file expects, then hand-fix the `_prisma_migrations` table with `UPDATE`/`INSERT` so `finished_at` reflects reality, and manually run (via psql) any migration SQL that was marked applied but never actually executed. Always re-check with `prisma migrate status` afterward.

**How to apply:** Any time schema.prisma changes and a new migration is needed in this Replit sandbox, follow the manual diff+apply steps above rather than attempting `prisma migrate dev` directly.
