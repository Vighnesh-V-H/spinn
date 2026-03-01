import "dotenv/config";
import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";

import { auth } from "@/lib/auth";
import { appRouter } from "@/routes/v1";

const app = new Hono();

app.use(
  "/api/v1/*",
  trpcServer({
    router: appRouter,
  }),
);

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

const port = Number(process.env.PORT ?? 8080);

console.log(`Server running at http://localhost:${port}`);

Bun.serve({
  fetch: app.fetch,
  port,
});
