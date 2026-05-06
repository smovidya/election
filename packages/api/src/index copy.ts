import { type ElysiaSwaggerConfig, swagger } from "@elysiajs/swagger";
import { env } from "cloudflare:workers";
import { Elysia } from "elysia";
import { devRoutes } from "./routes/dev/route";
import { electionRoutes } from "./routes/election/route";
import cors from "@elysiajs/cors";

const app = new Elysia({
  aot: false,
})
  .use(
    cors({
      aot: false,
      origin: env.SITE_URL,
    }),
  )
  .use(electionRoutes);

if (env.ENVIRONMENT === "dev") {
  app.mount("/dev", devRoutes);
}

export default app;
