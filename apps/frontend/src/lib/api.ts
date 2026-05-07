import { treaty } from "@elysia/eden";
import type { App } from "@repo/api";

export const api = treaty<App>(
	import.meta.env.PUBLIC_BACKEND_URL! || "http://localhost:8787",
);


export function authHeader() {
	const token = localStorage.getItem("session_token");
	if (!token) {
		return null;
	}

	return {
		Authorization: `Bearer ${token}`
	};
}