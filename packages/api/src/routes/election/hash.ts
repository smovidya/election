import { ok, err, type Result } from "neverthrow";

export async function hashVoterId(voterId: string, salt: string) {
  // 1. Encode string to bytes (Uint8Array)
  const msgUint8 = new TextEncoder().encode(voterId + salt);

  // 2. Compute the SHA-256 hash (returns an ArrayBuffer)
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);

  // 3. Convert ArrayBuffer to a hex string for readability
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return ok(hashHex);
}
