---
name: Express proxy to internal backend
description: Gotchas when a root Express app (bound to the public port) proxies /api/* to a separate internal Express+Prisma backend on localhost.
---

When splitting a single-port Replit app into a public frontend server (0.0.0.0) plus an internal backend service (localhost-only, different port), and using `app.use('/api', createProxyMiddleware(...))` in the public server to forward to the backend:

1. **Express strips the mount prefix before the proxy sees the request.** A request to `/api/auth/login` arrives at the proxy middleware as `/auth/login`. If the backend's own routes are still registered under `/api/...`, this causes silent 404s. Fix with `pathRewrite: (path) => '/api' + path` to restore the prefix.

2. **A global `express.json()` body parser upstream consumes the request stream before the proxy can forward it**, causing POST/PUT requests to hang indefinitely (not error — hang). Fix with `on: { proxyReq: fixRequestBody }` from `http-proxy-middleware` to re-serialize the already-parsed body onto the proxied request.

**Why:** Both issues are invisible from route code review — they only show up as either "route always 404s" or "request never resolves" at runtime. Confirmed via curl testing after wiring the proxy in this pattern.

**How to apply:** Any time you add `http-proxy-middleware` under a path-prefixed mount in front of a JSON-body Express backend, apply both fixes together before testing.
