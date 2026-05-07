// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import svelte from "@astrojs/svelte";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  output: "static",
  integrations: [react(), svelte()],
  // adapter: cloudflare(),
  env: {
    schema: {
      PUBLIC_BACKEND_URL: envField.string({
        context: "client",
        access: "public",
        default: "http://localhost:8787",
      }),
    },
  },
});
