import { router } from "@/lib/trpc/procedure";
import { apiKeyRouter } from "./api-key";
import { healthRouter } from "./health";
import { functionsRouter } from "./functions";

export const appRouter = router({
  health: healthRouter,
  apikey: apiKeyRouter,
  functions: functionsRouter,
});

export * from "@/lib/trpc/procedure";

export type AppRouter = typeof appRouter;
