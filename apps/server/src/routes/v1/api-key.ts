import { db } from "@/db";
import { apiKey } from "@/db/schema";
import { generateApiKey } from "@/lib/helper";
import { protectedProcedure, router } from "@/lib/trpc";
import { TRPCError } from "@trpc/server";
import { and, eq, isNull } from "drizzle-orm";
import { nanoid } from "nanoid";

function getApiKeyIdInput(input: unknown): string {
  if (
    !input ||
    typeof input !== "object" ||
    !("apiKeyId" in input) ||
    typeof input.apiKeyId !== "string" ||
    input.apiKeyId.length === 0
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "apiKeyId is required",
    });
  }

  return input.apiKeyId;
}

function getCreateInput(input: unknown): { name: string } {
  if (!input || typeof input !== "object") {
    return { name: "default" };
  }

  const name =
    "name" in input && typeof input.name === "string"
      ? input.name.trim()
      : "default";

  return {
    name: name.length > 0 ? name : "default",
  };
}

function getUpdateInput(input: unknown): { apiKeyId: string; name: string } {
  if (!input || typeof input !== "object") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "apiKeyId is required",
    });
  }

  const apiKeyId = getApiKeyIdInput(input);
  const name =
    "name" in input && typeof input.name === "string"
      ? input.name.trim()
      : "default";

  return {
    apiKeyId,
    name: name.length > 0 ? name : "default",
  };
}

export const apiKeyRouter = router({
  create: protectedProcedure.mutation(async ({ ctx, input }) => {
    const { apiKey: rawApiKey, publicPart, hashedSecret } = generateApiKey();
    const { name } = getCreateInput(input);

    const [createdApiKey] = await db
      .insert(apiKey)
      .values({
        id: nanoid(24),
        userId: ctx.user.id,
        name,
        publicPart,
        hashedSecret,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({
        id: apiKey.id,
        name: apiKey.name,
        publicPart: apiKey.publicPart,
        createdAt: apiKey.createdAt,
      });

    return {
      ...createdApiKey,
      apiKey: rawApiKey,
    };
  }),

  get: protectedProcedure.query(async ({ ctx, input }) => {
    const apiKeyId = getApiKeyIdInput(input);

    const [foundApiKey] = await db
      .select({
        id: apiKey.id,
        name: apiKey.name,
        publicPart: apiKey.publicPart,
        createdAt: apiKey.createdAt,
        updatedAt: apiKey.updatedAt,
        deletedAt: apiKey.deletedAt,
      })
      .from(apiKey)
      .where(
        and(
          eq(apiKey.id, apiKeyId),
          eq(apiKey.userId, ctx.user.id),
          isNull(apiKey.deletedAt),
        ),
      )
      .limit(1);

    if (!foundApiKey) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "API key not found",
      });
    }

    return foundApiKey;
  }),

  update: protectedProcedure.mutation(async ({ ctx, input }) => {
    const { apiKeyId, name } = getUpdateInput(input);

    const [existingApiKey] = await db
      .select({ id: apiKey.id })
      .from(apiKey)
      .where(
        and(
          eq(apiKey.id, apiKeyId),
          eq(apiKey.userId, ctx.user.id),
          isNull(apiKey.deletedAt),
        ),
      )
      .limit(1);

    if (!existingApiKey) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "API key not found",
      });
    }

    const { apiKey: rawApiKey, publicPart, hashedSecret } = generateApiKey();

    const [updatedApiKey] = await db
      .update(apiKey)
      .set({
        name,
        publicPart,
        hashedSecret,
        updatedAt: new Date(),
      })
      .where(and(eq(apiKey.id, apiKeyId), eq(apiKey.userId, ctx.user.id)))
      .returning({
        id: apiKey.id,
        name: apiKey.name,
        publicPart: apiKey.publicPart,
        updatedAt: apiKey.updatedAt,
      });

    return {
      ...updatedApiKey,
      apiKey: rawApiKey,
    };
  }),

  revoke: protectedProcedure.mutation(async ({ ctx, input }) => {
    const apiKeyId = getApiKeyIdInput(input);

    const [revokedApiKey] = await db
      .update(apiKey)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(apiKey.id, apiKeyId),
          eq(apiKey.userId, ctx.user.id),
          isNull(apiKey.deletedAt),
        ),
      )
      .returning({
        id: apiKey.id,
        deletedAt: apiKey.deletedAt,
      });

    if (!revokedApiKey) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "API key not found or already revoked",
      });
    }

    return revokedApiKey;
  }),
});
