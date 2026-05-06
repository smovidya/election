import { Elysia } from "elysia";
import { type CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import { type D1Database } from "@cloudflare/workers-types";
import { openapi, fromTypes } from "@elysia/openapi";
import { cors } from "@elysiajs/cors";
import jwt from "@elysiajs/jwt";
import { AuthModel, AuthService } from "$lib/auth";
import { currentTime } from "$lib/time";
import { ElectionService } from "./routes/election/service";
import { err, fromPromise } from "neverthrow";

export type Params = {
  isDev: boolean;
  DB?: D1Database;
  SITE_URL?: string;
  GOOGLE_CLIENT_ID?: string;
  JWT_SECRET: string;
};

export type AppEnv = {
  IS_DEV: boolean;
  DB: D1Database;
  SITE_URL: string;
  GOOGLE_CLIENT_ID: string;
  JWT_SECRET: string;
};

type Adapter = typeof CloudflareAdapter;

export function createApp(adapter: Adapter, params: Params) {
  const env = {
    IS_DEV: params.isDev,
    DB: params.DB,
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
    .decorate("election", new ElectionService())
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
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 3, // 3 hours
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
    );
  // .group("", (app) =>
  //   app.use(auth(env)).guard(
  //     {
  //       beforeHandle({ user, error }) {
  //         if (user.isErr()) {
  //           const statusCode =
  //             user.error === "missing-authorization" ||
  //             user.error === "invalid-token"
  //               ? 401
  //               : 403;

  //           return error(statusCode, {
  //             success: false,
  //             error: user.error,
  //           });
  //         }
  //       },
  //     },
  //     (app) =>
  //       app
  //         // this is probably elysia and/or typescript issue
  //         .resolve(({ user }) => ({ user: user._unsafeUnwrap() }))
  //         .post(
  //           "/api/vote",
  //           async ({
  //             body: { votes },
  //             election,
  //             user: { studentId },
  //             error,
  //             currentTime,
  //           }) => {
  //             const votingPeriodChecker = election.votingPeriodChecker({
  //               currentTime,
  //             });

  //             if (votingPeriodChecker.isErr()) {
  //               return error(403, {
  //                 success: false,
  //                 error: votingPeriodChecker.error,
  //               });
  //             }

  //             const isVoted = await election.isVoted({ voterId: studentId });

  //             if (isVoted.isErr()) {
  //               return error(500, {
  //                 success: false,
  //                 error: isVoted.error,
  //               });
  //             }

  //             if (isVoted.value.isVoted) {
  //               return error(403, {
  //                 success: false,
  //                 error: "voted-already",
  //               });
  //             }

  //             const voteResult = await election.addVotes({
  //               voterId: studentId,
  //               votes,
  //             });

  //             if (voteResult.isErr()) {
  //               return error(500, {
  //                 success: false,
  //                 error: voteResult.error,
  //               });
  //             }

  //             return {
  //               success: true,
  //             };
  //           },
  //           {
  //             body: t.Object({
  //               votes: t.Array(Vote, {
  //                 description: "Votes to be submitted",
  //                 maxItems: electionInfo.positions.length,
  //                 minItems: electionInfo.positions.length,
  //                 uniqueItems: true,
  //                 examples: [
  //                   [
  //                     // Create a random vote for each position :P
  //                     ...electionInfo.positions.map((position, i) => ({
  //                       candidateId:
  //                         i === 5 && Math.random() > 0.5
  //                           ? "disapprove"
  //                           : i % 3 === 0
  //                             ? "no-vote"
  //                             : 6030000023 + i * 100,
  //                       position: position.const,
  //                     })),
  //                   ],
  //                 ],
  //               }),
  //             }),
  //             detail: {
  //               description: "Submit votes from a student",
  //             },
  //             response: {
  //               200: apiOk(undefined, {
  //                 description: "Vote submission result",
  //               }),
  //               401: apiError(AuthUnauthorizedError, {
  //                 description: "Unauthorized",
  //               }),
  //               403: apiError(mergeUnionEnum(VoteError, AuthForbiddenError), {
  //                 description: "Forbidden to vote",
  //               }),
  //               500: apiInternalError(),
  //             },
  //           },
  //         )
  //         .get(
  //           "/api/eligibility",
  //           async ({ election, user: { studentId }, error, auth }) => {
  //             const verifyRightToVote = await auth.verifyRight(studentId);

  //             if (verifyRightToVote.isErr()) {
  //               return error(403, {
  //                 success: false,
  //                 error: verifyRightToVote.error,
  //               });
  //             }

  //             const isVoted = await election.isVoted({ voterId: studentId });

  //             if (isVoted.isErr()) {
  //               return error(500, {
  //                 success: false,
  //                 error: isVoted.error,
  //               });
  //             }

  //             return {
  //               success: true,
  //               eligible: !isVoted.value.isVoted,
  //               reason: isVoted.value.isVoted ? "voted-already" : undefined,
  //             };
  //           },
  //           {
  //             response: {
  //               200: apiOk(
  //                 t.Object({
  //                   eligible: t.Boolean({
  //                     description:
  //                       "Whether the student is eligible to vote or not",
  //                     title: "Eligibility",
  //                     examples: [true, false],
  //                   }),
  //                   reason: t.Optional(
  //                     t.String({
  //                       description:
  //                         "The reason why the student is not eligible to vote",
  //                       title: "Reason",
  //                     }),
  //                   ),
  //                 }),
  //                 {
  //                   description: "Eligibility check result",
  //                 },
  //               ),
  //               401: apiError(AuthUnauthorizedError, {
  //                 description: "Unauthorized",
  //               }),
  //               403: apiError(AuthForbiddenError, {
  //                 description: "Forbidden to access",
  //               }),
  //               500: apiInternalError(),
  //             },
  //             detail: {
  //               description:
  //                 "Check if the current student is eligible to vote",
  //             },
  //           },
  //         )
  //         .get(
  //           "/api/me",
  //           ({ user: { studentId, studentName }, currentTime }) => ({
  //             success: true,
  //             studentId,
  //             studentName,
  //             currentTime,
  //           }),
  //           {
  //             detail: {
  //               description:
  //                 "Get the current student ID and the current date/time specified by the token",
  //             },
  //             response: {
  //               200: apiOk(
  //                 t.Object({
  //                   studentId: t.String({
  //                     description: "The user's student ID",
  //                   }),
  //                   studentName: t.String({
  //                     description:
  //                       "The user's student name from Google OAuth",
  //                   }),
  //                   currentTime: t.Date({
  //                     description: "Current timestamp",
  //                   }),
  //                 }),
  //                 {
  //                   description: "Current user information",
  //                 },
  //               ),
  //               401: apiError(AuthUnauthorizedError, {
  //                 description: "Unauthorized",
  //               }),
  //               403: apiError(AuthForbiddenError, {
  //                 description: "Forbidden to access",
  //               }),
  //             },
  //           },
  //         ),
  //   ),
  // )
  // .get(
  //   "/api/voter-count",
  //   async ({ election, error, currentTime }) => {
  //     const count = await election.currentVoterCount();

  //     if (count.isErr()) {
  //       return error(500, {
  //         success: false,
  //         error: count.error,
  //       });
  //     }

  //     return {
  //       success: true,
  //       count: count.value.count,
  //       asOf: new Date(currentTime),
  //     };
  //   },
  //   {
  //     detail: {
  //       description: "Get the current number of voters who have voted",
  //     },
  //     response: {
  //       200: apiOk(
  //         t.Object({
  //           count: t.Number({
  //             description: "The current number of voters who have voted",
  //             title: "Voter Count",
  //           }),
  //           asOf: t.Date({
  //             description: "The date/time when the count is taken",
  //             title: "As of",
  //           }),
  //         }),
  //         {
  //           description: "Current voter count",
  //         },
  //       ),
  //       500: apiInternalError(),
  //     },
  //   },
  // )
  // .get(
  //   "/api/election-result",
  //   async ({ election, currentTime }) => {
  //     const availabilty = election.announcementPeriodChecker({ currentTime });

  //     if (availabilty.isErr()) {
  //       return error(403, {
  //         success: false,
  //         error: availabilty.error,
  //       });
  //     }
  //     const result = await election.getElectionResults();
  //     if (result.isErr()) {
  //       return error(500, {
  //         success: false,
  //         error: result.error,
  //       });
  //     }

  //     return {
  //       success: true,
  //       result,
  //     };
  //   },
  //   {
  //     detail: {
  //       description: "Get the election result after the election period",
  //     },
  //     response: {
  //       200: apiOk(
  //         t.Object({
  //           result: ElectionResult,
  //         }),
  //         {
  //           description: "Election result (after the election period)",
  //         },
  //       ),
  //       403: apiError(ElectionPeriodError, {
  //         description: "Forbidden to access",
  //       }),
  //       500: apiInternalError(),
  //     },
  //   },
  // );

  return app;
}

export type App = ReturnType<typeof createApp>;
