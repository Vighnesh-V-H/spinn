import { router } from "@/lib/trpc/procedure";
import { healthRouter } from "./health";

export const appRouter = router({
  health: healthRouter,
});

export * from "@/lib/trpc/procedure";

export type AppRouter = typeof appRouter;
