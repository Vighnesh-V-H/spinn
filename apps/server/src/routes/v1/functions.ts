import { type TRPCRouterRecord, TRPCError } from "@trpc/server";
import { apiKeyProcedure } from "@/lib/trpc/procedure";
import { db } from "@/db";
import { functions as functionsTable } from "@/db/schema";
import { nanoid } from "nanoid";

function getRegisterInput(input: unknown): {
  callbackURL: string;
  functions: Array<{ id: string; retries: number; event: { event: string } }>;
} {
  if (!input || typeof input !== "object") {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid input" });
  }

  const i = input as Record<string, unknown>;

  if (typeof i.callbackURL !== "string" || i.callbackURL.length === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "callbackURL is required",
    });
  }

  if (!Array.isArray(i.functions) || i.functions.length === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "functions array is required",
    });
  }

  const fns = (i.functions as unknown[]).map((fn) => {
    if (!fn || typeof fn !== "object") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid function definition",
      });
    }

    const f = fn as Record<string, unknown>;

    if (typeof f.id !== "string" || f.id.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Function id is required",
      });
    }

    if (!f.event || typeof f.event !== "object") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Function event is required",
      });
    }

    const ev = f.event as Record<string, unknown>;

    if (typeof ev.event !== "string" || ev.event.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Function event.event string is required",
      });
    }

    return {
      id: f.id,
      retries: typeof f.retries === "number" ? f.retries : 0,
      event: { event: ev.event },
    };
  });

  return { callbackURL: i.callbackURL, functions: fns };
}

export const functionsRouter = {
  register: apiKeyProcedure.mutation(async ({ ctx, input }) => {
    const { callbackURL, functions } = getRegisterInput(input);
    const userId = ctx.user.id;

    for (const fn of functions) {
      await db
        .insert(functionsTable)
        .values({
          id: nanoid(24),
          userId,
          functionId: fn.id,
          callbackURL,
          event: fn.event.event,
          retries: fn.retries,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [functionsTable.userId, functionsTable.functionId],
          set: {
            callbackURL,
            event: fn.event.event,
            retries: fn.retries,
            updatedAt: new Date(),
          },
        });
    }

    return { success: true, registered: functions.length };
  }),
} satisfies TRPCRouterRecord;
