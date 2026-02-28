import { Hono } from "hono";

import { authRoutes } from "@/routes/v1/auth";
import { healthRoutes } from "@/routes/v1/health";
import { trpcRoutes } from "@/routes/v1/trpc";

export function registerRoutes(app: Hono) {
  app.route("/api/v1", healthRoutes);
  app.route("/api/v1", trpcRoutes);
  app.route("/api/v1", authRoutes);
}
