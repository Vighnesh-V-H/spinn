import "dotenv/config";
import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";

import { appRouter } from "@/routes/v1";

const app = new Hono();

app.use(
	"/api/v1/*",
	trpcServer({
		router: appRouter,
	}),
);

const port = Number(process.env.PORT ?? 8081);

console.log(`Cloud server running at http://localhost:${port}`);

Bun.serve({
	fetch: app.fetch,
	port,
});