import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export interface Context extends Record<string, unknown> {}

export const createContext = async (
  _opts: FetchCreateContextFnOptions,
): Promise<Context> => {
  return {};
};
