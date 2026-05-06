import Elysia from "elysia";
import { AppEnv } from "..";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";

// this wont do anything to the response
export const currentTime = (env: AppEnv) =>
  new Elysia({
    name: "current-time",
    adapter: CloudflareAdapter,
  }).derive({ as: "scoped" }, ({ headers }) => {
    const now = new Date();
    if (env.IS_DEV && headers.authorization?.startsWith("Basic ")) {
      const [_, rawToken] = headers.authorization.split(" ");

      if (rawToken) {
        const token = Buffer.from(rawToken, "base64").toString("utf-8");
        const [__, ...time] = token.split(":"); // js is shit

        console.log("[DEV] Mock time:", time.join(":") || "now");

        // early return???
        if (time) {
          const date = new Date(time.join(":"));
          if (!Number.isNaN(date.valueOf())) {
            // sometime we will get an invalid date
            return {
              currentTime: date,
            };
          }
        }
      }
    }

    return {
      currentTime: now,
    };
  });
