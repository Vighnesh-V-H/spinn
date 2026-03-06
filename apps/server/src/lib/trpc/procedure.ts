import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";
import SuperJSON from "superjson";
import { createHash } from "crypto";
import { db } from "@/db";
import { apiKey as apiKeyTable, user as userTable } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    console.warn("Unauthorized access attempt");
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  return next({
    ctx: {
      user: ctx.user,
      session: ctx.session,
    },
  });
});

export const apiKeyProcedure = t.procedure.use(async ({ input: rawInput, next }) => {
  const input = rawInput as unknown as Record<string, unknown> | null | undefined;

  if (!input?.apiKey || typeof input.apiKey !== "string") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "API key is required",
    });
  }

  const raw = input.apiKey;
  const withoutPrefix = raw.startsWith("spinn_") ? raw.slice(6) : raw;
  const dotIndex = withoutPrefix.indexOf(".");

  if (dotIndex === -1) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid API key format",
    });
  }

  const publicPart = withoutPrefix.slice(0, dotIndex);
  const secretPart = withoutPrefix.slice(dotIndex + 1);
  const hashedSecret = createHash("sha256").update(secretPart).digest("hex");

  const [keyRecord] = await db
    .select()
    .from(apiKeyTable)
    .where(
      and(
        eq(apiKeyTable.publicPart, publicPart),
        eq(apiKeyTable.hashedSecret, hashedSecret),
        isNull(apiKeyTable.deletedAt),
      ),
    )
    .limit(1);

  if (!keyRecord) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or revoked API key",
    });
  }

  const [userRecord] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, keyRecord.userId))
    .limit(1);

  if (!userRecord) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" });
  }

  return next({ ctx: { user: userRecord, session: null } });
});
