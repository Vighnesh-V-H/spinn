import { Hono } from "hono";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@/api/trpc";

export const trpcRoutes = new Hono();

trpcRoutes.all("/trpc/*", (c) => {
  return fetchRequestHandler({
    endpoint: "/api/v1/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext: () => ({}),
  });
});
