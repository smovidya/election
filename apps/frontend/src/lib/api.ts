import { treaty } from "@elysia/eden";
import type { App } from "@repo/api";
import { API_URL } from "astro:env/client";

export const api = treaty<App>(
  import.meta.env.DEV
    ? "http://localhost:8787"
    : API_URL || "http://localhost:8787",
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
