import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";

const PORT = Number(process.env.BACKEND_PORT) || 3001;

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.get("/api/backend-health", (_req, res) => {
  res.json({ status: "ok", service: "backend" });
});

app.use("/api/auth", authRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, "localhost", () => {
  console.log(`[JustCarSale backend] Listening on http://localhost:${PORT}`);
});
