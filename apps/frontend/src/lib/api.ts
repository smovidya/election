import { treaty } from "@elysia/eden";
import type { App } from "@repo/api";

export const api = treaty<App>(
	import.meta.env.PUBLIC_BACKEND_URL! || "http://localhost:8787",
);
