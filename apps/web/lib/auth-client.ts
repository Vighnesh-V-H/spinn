"use client";

import { createAuthClient } from "better-auth/react";

const baseURL =
  process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:8080/api/v1/auth";

export const authClient = createAuthClient({
  baseURL,
});

export const { signIn, signOut, signUp, useSession } = authClient;
