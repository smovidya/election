import { Elysia, t } from "elysia";
import { type CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import { KVNamespace, type D1Database } from "@cloudflare/workers-types";
import { openapi, fromTypes } from "@elysia/openapi";
import { cors } from "@elysiajs/cors";
import jwt from "@elysiajs/jwt";
import {
  AuthModel,
  AuthService,
  AuthUnauthorizedError,
  AuthForbiddenError,
} from "$lib/auth";
import { currentTime } from "$lib/time";
import {
  ElectionService,
  ElectionPeriodError,
  VoteError,
} from "./routes/election/service";
import { Vote, ElectionResult } from "./routes/election/schema";
import { running_positions } from "@repo/constants";
import { err, fromPromise } from "neverthrow";

export type Params = {
  isDev: boolean;
  DB?: D1Database;
  KV?: KVNamespace;
  SITE_URL?: string;
  GOOGLE_CLIENT_ID?: string;
  JWT_SECRET: string;
};

export type AppEnv = {
  IS_DEV: boolean;
  DB: D1Database;
  KV: KVNamespace;
  SITE_URL: string;
  GOOGLE_CLIENT_ID: string;
  JWT_SECRET: string;
};

type Adapter = typeof CloudflareAdapter;

export function createApp(adapter: Adapter, params: Params) {
  const env = {
    IS_DEV: params.isDev,
    DB: params.DB,
    KV: params.KV,
    SITE_URL: params.SITE_URL,
    GOOGLE_CLIENT_ID: params.GOOGLE_CLIENT_ID,
    JWT_SECRET: params.JWT_SECRET,
  } as AppEnv;

  const app = new Elysia({
    adapter,
  })
    .use(
      cors({
        origin: params.isDev ? "*" : params.SITE_URL,
      }),
    )
    .use(
      openapi({
        references: fromTypes(),
      }),
    )
    .use(
      jwt({
        iss: "mookrob.vidyachula.org",
        secret: env.JWT_SECRET,
      }),
    )
    .use(currentTime(env))
    .derive(async ({ headers, jwt }) => {
      const auth = new AuthService(headers, env);
      const [_, token] = headers.authorization?.split(" ") ?? [];
      if (!token) {
        return {
          auth,
          user: err("missing-authorization"),
        };
      }

      const user = await fromPromise(
        jwt.verify(token, {
          issuer: "mookrob.vidyachula.org",
        }) as Promise<{ studentId: string; studentName: string }>,
        () => "invalid-token" as const,
      );

      return {
        auth,
        user,
      };
    })
    .group("/auth", (app) =>
      app
        .use(AuthModel)
        .post(
          "/login",
          async ({ body, jwt, auth, status }) => {
            const { googleIdToken } = body;

            const userResult = await auth.getStudentId(googleIdToken);

            if (userResult.isErr()) {
              if (userResult.error === "invalid-token") {
                return status(401, {
                  error: userResult.error,
                });
              }

              return status(403, {
                error: userResult.error,
              });
            }

            const signedToken = await jwt.sign({
              t: "session",
              studentId: userResult.value.studentId,
              studentName: userResult.value.name,
              exp: Math.floor(Date.now() / 1000) + 60 * 30, // 30 minutes
              nbf: Math.floor(Date.now() / 1000) - 60, // 1 minute ago to prevent clock skew issues
            });

            return {
              jwtSessionToken: signedToken,
            };
          },
          {
            body: "LoginRequestBody",
            response: {
              200: "LoginSuccessResponse",
              401: "UnauthorizedResponse",
              403: "ForbiddenResponse",
            },
          },
        )
        .get(
          "/me",
          ({ jwt, user, status }) => {
            if (user.isErr()) {
              return status(401, {
                error: user.error,
              });
            }

            return user.value;
          },
          {
            response: {
              200: "MeSuccessResponse",
              401: "UnauthorizedResponse",
            },
          },
        ),
    )
    .get("/health", () => ({ status: "ok" as const }), {
      detail: {
        description: "Health check endpoint",
      },
      response: {
        200: t.Object({
          status: t.Literal("ok"),
        }),
      },
    })
    .group("/election", (app) =>
      app
        .decorate(
          "election",
          new ElectionService(env.DB, env.JWT_SECRET, env.KV),
        )
        .get(
          "/voter-count",
          async ({ election, status }) => {
            const countResult = await election.currentVoterCount();

            if (countResult.isErr()) {
              return status(500, { error: countResult.error });
            }

            return { voterCount: countResult.value };
          },
          {
            detail: {
              description:
                "Get the current number of voters who have cast their votes",
            },
          },
        )
        .get(
          "/result",
          async ({ election, currentTime, status }) => {
            const availability = election.announcementPeriodChecker({
              currentTime,
            });
            if (availability.isErr()) {
              return status(403, { error: availability.error });
            }
            const result = await election.getElectionResults();
            if (result.isErr()) {
              return status(500, { error: result.error });
            }
            return result.value;
          },
          {
            detail: {
              description: "Get election results after announcement period",
            },
            response: {
              200: ElectionResult,
              403: t.Object({ error: ElectionPeriodError }),
              500: t.Object({ error: t.String() }),
            },
          },
        )
        .post(
          "/cast-vote",
          async ({ election, user, body, currentTime, status }) => {
            if (user.isErr()) {
              return status(401, { error: user.error });
            }

            const periodCheck = election.votingPeriodChecker({ currentTime });
            if (periodCheck.isErr()) {
              return status(403, { error: periodCheck.error });
            }

            const isVotedResult = await election.isVoted({
              voterId: user.value.studentId,
            });
            if (isVotedResult.isErr()) {
              return status(500, { error: isVotedResult.error });
            }

            if (isVotedResult.value.isVoted) {
              return status(403, { error: "voted-already" as const });
            }

            const voteResult = await election.addVotes({
              voterId: user.value.studentId,
              votes: body.votes,
            });
            if (voteResult.isErr()) {
              return status(500, { error: voteResult.error });
            }

            return { success: true as const };
          },
          {
            body: t.Object({
              votes: t.Array(Vote, {
                description: "Votes to be submitted",
                maxItems: running_positions.length,
                minItems: running_positions.length,
                uniqueItems: true,
              }),
            }),
            detail: { description: "Submit votes from a student" },
            response: {
              200: t.Object({ success: t.Literal(true) }),
              401: t.Object({ error: AuthUnauthorizedError }),
              403: t.Object({ error: t.Union([VoteError]) }),
              500: t.Object({ error: t.String() }),
            },
          },
        )
        .get(
          "/eligibility",
          async ({ election, user, auth, status }) => {
            if (user.isErr()) {
              return status(401, { error: user.error });
            }

            const verifyRight = await auth.verifyRight(user.value.studentId);
            if (verifyRight.isErr()) {
              return status(403, { error: verifyRight.error });
            }

            const isVotedResult = await election.isVoted({
              voterId: user.value.studentId,
            });
            if (isVotedResult.isErr()) {
              return status(500, { error: isVotedResult.error });
            }

            return {
              eligible: !isVotedResult.value.isVoted,
              reason: isVotedResult.value.isVoted
                ? ("voted-already" as const)
                : undefined,
            };
          },
          {
            detail: {
              description: "Check if the current student is eligible to vote",
            },
            response: {
              200: t.Object({
                eligible: t.Boolean({
                  description: "Whether the student is eligible to vote",
                  examples: [true, false],
                }),
                reason: t.Optional(
                  t.String({
                    description:
                      "The reason why the student is not eligible to vote",
                  }),
                ),
              }),
              401: t.Object({ error: AuthUnauthorizedError }),
              403: t.Object({ error: AuthForbiddenError }),
              500: t.Object({ error: t.String() }),
            },
          },
        ),
    );
  return app;
}

export type App = ReturnType<typeof createApp>;
