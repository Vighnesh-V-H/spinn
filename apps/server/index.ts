import "dotenv/config";

import { Hono } from "hono";
import { cors } from "hono/cors";

import { registerRoutes } from "@/routes/v1";

const app = new Hono();

app.use("*", cors({ origin: "http://localhost:3000", credentials: true }));

registerRoutes(app);

const port = Number(process.env.PORT ?? 8080);

console.log(`Server running at http://localhost:${port}`);

Bun.serve({
  fetch: app.fetch,
  port,
});
