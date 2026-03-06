import { type TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure, publicProcedure } from "@/lib/trpc/procedure";

export const functionsRouter = {
  register: protectedProcedure.query(() => {
    console.log("Health check endpoint called");
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }),
} satisfies TRPCRouterRecord;
