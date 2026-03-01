import { initTRPC, TRPCError } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { auth } from "@/lib/auth";
import type { User, Session } from "better-auth";
import superjson from "superjson";

export interface Context extends Record<string, unknown> {
  user: User | null;
  session: Session | null;
}

export const createContext = async (
  opts: FetchCreateContextFnOptions,
): Promise<Context> => {
  try {
    const session = await auth.api.getSession({
      headers: opts.req.headers,
    });

    return {
      user: session?.user || null,
      session: session?.session || null,
    };
  } catch (error) {
    console.error("Failed to create tRPC context", error);
    return {
      user: null,
      session: null,
    };
  }
};
