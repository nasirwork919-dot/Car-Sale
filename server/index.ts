import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import vehicleRoutes from "./routes/vehicleRoutes";
import businessRoutes from "./routes/businessRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import marketplaceRoutes from "./routes/marketplaceRoutes";

const PORT = Number(process.env.BACKEND_PORT) || 3001;

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.get("/api/backend-health", (_req, res) => {
  res.json({ status: "ok", service: "backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/marketplace", marketplaceRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, "localhost", () => {
  console.log(`[JustCarSale backend] Listening on http://localhost:${PORT}`);
});
