import { router, publicProcedure } from "@/lib/trpc";
import { protectedProcedure } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(async ({ ctx }) => {
    return {
      user: ctx.user,
      session: ctx.session,
    };
  }),

  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});
