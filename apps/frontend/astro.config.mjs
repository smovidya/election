// @ts-check

import react from "@astrojs/react";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},
	output: "static",
	integrations: [
		react(),
		svelte(),
		{
			name: "election-dev-tools",
			hooks: {
				"astro:config:setup": ({ addDevToolbarApp }) => {
					addDevToolbarApp({
						id: "election-dev-tools",
						name: "Election mocks",
						icon: "🗳️",
						entrypoint: "./src/dev-toolbar/election.ts",
					});
				},
			},
		},
	],
	// adapter: cloudflare(),
	env: {
		schema: {
			APP_ENV: envField.enum({
				context: "client",
				access: "public",
				values: ["dev", "staging", "production"],
				default: "production",
			}),
			API_URL: envField.string({
				context: "client",
				access: "public",
				default: "http://localhost:8787",
			}),
		},
	},
});
