import { nanoid } from "nanoid";
import { createHash } from "crypto";

export function createAPIKey(length: number = 21): string {
  return `spinn-${nanoid(length)}`;
}

export function generateApiKey() {
  const publicPart = nanoid(10);
  const secretPart = nanoid(32);

  const apiKey = `spinn_${publicPart}.${secretPart}`;

  const hashedSecret = createHash("sha256").update(secretPart).digest("hex");

  return {
    apiKey,
    publicPart,
    hashedSecret,
  };
}
