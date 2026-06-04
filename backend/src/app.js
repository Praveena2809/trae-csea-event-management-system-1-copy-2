import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import venueRoutes from "./routes/venueRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import coordinatorApplicationRoutes from "./routes/coordinatorApplicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

export const app = express();

//app.use(helmet());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Local static files (used when Cloudinary is not configured)
app.use("/uploads", express.static("uploads"));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/coordinator-applications", coordinatorApplicationRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);
