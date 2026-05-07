import { treaty } from "@elysia/eden";
import type { App } from "@repo/api";

export const api = treaty<App>(
  import.meta.env.DEV
    ? "http://localhost:8787"
    : import.meta.env.PUBLIC_BACKEND_URL?.includes("staging")
      ? "https://election-api-staging.vidyachula.org"
      : "https://election-api.vidyachula.org",
);

export function authHeader() {
  const token = localStorage.getItem("session_token");
  if (!token) {
    return null;
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}
