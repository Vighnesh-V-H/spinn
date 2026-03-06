import { type TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "@/lib/trpc/procedure";

export const healthRouter = {
  check: publicProcedure.query(() => {
    console.log("Health check endpoint called");
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }),
} satisfies TRPCRouterRecord;
