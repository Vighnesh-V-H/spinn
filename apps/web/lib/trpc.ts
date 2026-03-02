import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@spinn/server";
import superjson from "superjson";

const trpcBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${trpcBaseUrl}/api/v1`,
      transformer: superjson,
    }),
  ],
});
