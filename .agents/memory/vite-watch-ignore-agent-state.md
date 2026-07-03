---
name: Vite watcher must ignore agent/runtime state dirs
description: Vite full-page-reload storms caused by watching .local/.cache/.agents; fix and how to tell it apart from a real app bug
---

Vite's dev server, by default, watches the whole project directory. Agent tooling continuously writes to
`.local/state/` (transcripts, workflow logs) and `.cache/` during a session. If these aren't excluded from
`server.watch`, Vite treats every write as a source change and triggers a full page reload every few seconds.

**Why:** A reload storm faster than an in-app splash/intro timer (e.g. ~2-3s) makes the app look permanently
"stuck loading" — the timer never gets a chance to fire because the page keeps reloading from scratch. This can
look exactly like an infinite re-render bug in the app code, wasting significant debugging time chasing a
nonexistent React bug.

**How to apply:** In `vite.config.ts`, set `server.watch.ignored` to include `**/.local/**`, `**/.cache/**`,
`**/.git/**`, `**/.agents/**` (keep this alongside any existing `DISABLE_HMR`-based watch toggling). Before
assuming a "stuck on loading screen" report is an app bug, check the workflow logs for a burst of
`[vite] (client) page reload <path under .local or .cache>` lines — if present, it's this issue, not application
logic.

Separately: the `screenshot` (app_preview) tool appears to load a fresh page each invocation and capture within
~1-2s, so a splash/intro screen with a multi-second timer will show as "stuck" in every screenshot even when the
app is working correctly. Verify real render behavior via temporary `console.count()` in the root component (render
count resets to 1 each call = fresh load each time, not a hang) or via direct API/curl testing rather than relying
solely on repeated screenshots to catch the post-splash state.
