---
name: Admin role convention
description: How admin/authority access is modeled when the schema has no dedicated ADMIN role
---

The `UserRole` enum has no `ADMIN` value (only PERSONAL, BUSINESS, INSURANCE, WORKSHOP, LOGISTICS, GOVERNMENT, POLICE).

`GOVERNMENT` is reused as the admin role: all `/api/admin/*` endpoints and the government-only dashboard are gated with `requireRole("GOVERNMENT")`.

**Why:** Matches an existing precedent in the same codebase where `WORKSHOP` is reused as an inspector-role proxy (no dedicated INSPECTOR role exists either). Adding a new enum value would require a migration; reusing an existing role avoids that and was the user's explicit fallback instruction.

**How to apply:** Any future admin-only or platform-authority feature should continue to check for `GOVERNMENT` rather than introducing a new role, unless the user explicitly asks to add a real `ADMIN` enum value (which would require a schema migration — see the Prisma migrations memory for how to apply it in this environment).

Related: banning a user is done by setting `User.deletedAt`, which the existing auth controller already checks on login/verification flows — no additional enforcement code was needed for bans to take effect.
