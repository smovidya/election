import { API_URL } from "astro:env/client";
import { treaty } from "@elysia/eden";
import type { App } from "@repo/api";
import { mockTime } from "./clock";

const apiUrl = import.meta.env.DEV
	? "http://localhost:8787"
	: API_URL || "http://localhost:8787";

export const api = treaty<App>(apiUrl, {
	headers: () => {
		const time = mockTime();
		return time ? { "X-Dev-Time": time } : {};
	},
});

export function authHeader() {
	const token = localStorage.getItem("session_token");
	if (!token) {
		return null;
	}

	return {
		Authorization: `Bearer ${token}`,
	};
}
