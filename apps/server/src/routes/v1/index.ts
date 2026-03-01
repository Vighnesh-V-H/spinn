import { router } from "@/lib/trpc";
import { healthRouter } from "./health";

export const appRouter = router({
  health: healthRouter,
});

export type AppRouter = typeof appRouter;
