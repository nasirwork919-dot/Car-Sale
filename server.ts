import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

const BACKEND_PORT = Number(process.env.BACKEND_PORT) || 3001;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

// Global, in-memory repository for temporary cross-device photo uploads.
// In-memory maps survive within the actively running dev/test container.
const photoSessions = new Map<string, Record<string, string>>();

async function startServer() {
  const app = express();
  const PORT = 5000;

  // Set body parsers with ample limit for base64 image transmissions
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ limit: "20mb", extended: true }));

  // --- Synchronization Endpoints for Desktop-to-Mobile Camera Transfer ---

  // Upload a base64 photo captured on mobile
  app.post("/api/photo-sync/upload", (req, res) => {
    const { sessionId, photoKey, imageBytes } = req.body;
    
    if (!sessionId || !photoKey || !imageBytes) {
      res.status(400).json({ error: "Missing required parameters: sessionId, photoKey, or imageBytes" });
      return;
    }

    if (!photoSessions.has(sessionId)) {
      photoSessions.set(sessionId, {});
    }

    const sessionPhotos = photoSessions.get(sessionId)!;
    sessionPhotos[photoKey] = imageBytes;
    
    res.json({ success: true, message: `Photo synced for key '${photoKey}' under session '${sessionId}'` });
  });

  // Pull all synchronized photos for desktop
  app.get("/api/photo-sync/session/:sessionId", (req, res) => {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      res.status(400).json({ error: "No sessionId provided" });
      return;
    }

    const photos = photoSessions.get(sessionId) || {};
    res.json({ success: true, photos });
  });

  // Reset or clear session photos (e.g. after finish or manual reset)
  app.post("/api/photo-sync/clear", (req, res) => {
    const { sessionId } = req.body;
    
    if (sessionId) {
      photoSessions.delete(sessionId);
    }
    res.json({ success: true });
  });

  // Simple health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // --- Proxy all other /api/* traffic to the standalone backend service ---
  // (Express + Prisma + PostgreSQL, running on localhost only, see /server)
  // Note: Express strips the "/api" mount prefix before invoking this
  // middleware, so we restore it via pathRewrite. We also restream the
  // already-parsed JSON body (fixRequestBody) since express.json() above
  // consumed the raw request stream before the proxy can forward it.
  app.use(
    "/api",
    createProxyMiddleware({
      target: BACKEND_URL,
      changeOrigin: true,
      pathRewrite: (path) => `/api${path}`,
      on: {
        proxyReq: fixRequestBody,
      },
    })
  );

  // --- Vite Dev Middleware and Production Static Serves ---
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting backend in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting backend in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[JustCarSale server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
