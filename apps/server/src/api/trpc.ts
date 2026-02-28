import { publicProcedure, router } from "@/lib/trpc";

export const appRouter = router({
  health: publicProcedure.query(() => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  })),
});

export type AppRouter = typeof appRouter;