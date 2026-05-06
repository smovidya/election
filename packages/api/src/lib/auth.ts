import { AppEnv, Params } from "..";
import Elysia, { type Static, t } from "elysia";
import { Auth, type KeyStorer } from "firebase-auth-cloudflare-workers";
// firebase-admin wont run on cf worker so i use this instead
import { type Result, ResultAsync, err, ok } from "neverthrow";

class NoKVStore implements KeyStorer {
  async get() {
    return null;
  }
  async put(value: string, expirationTtl: number) {}
}

export const User = t.Object({
  studentId: t.String({
    title: "Student ID",
    description: "The student's ID, e.g. 60300000123",
    examples: ["60300000123"],
  }),
  studentName: t.String({
    title: "Student Name",
    description: "The student's name, e.g. John Doe",
    examples: ["John Doe", "สมชาย ใจดี"],
  }),
});
export type User = Static<typeof User>;

export const AuthUnauthorizedError = t.UnionEnum([
  "missing-authorization",
  "invalid-token",
]);
export const AuthForbiddenError = t.UnionEnum([
  "not-chula",
  "invalid-student-id",
  "not-science-student",
]);
export const AuthError = t.Union([AuthUnauthorizedError, AuthForbiddenError]);
export type AuthError = Static<typeof AuthError>;

export class AuthService {
  constructor(
    public headers: Record<string, string | undefined>,
    public env: AppEnv,
  ) {}

  async getStudentId(idToken: string) {
    const auth = Auth.getOrInitialize(
      this.env.GOOGLE_CLIENT_ID!,
      new NoKVStore(),
      // if we want to cache the public key used to verify the Firebase ID we can use this
      // WorkersKVStoreSingle.getOrInitialize(env.PUBLIC_JWK_CACHE_KEY, env.PUBLIC_JWK_CACHE_KV)
    );

    const token = await ResultAsync.fromPromise(
      auth.verifyIdToken(idToken),
      () => [],
    );

    if (token.isErr()) {
      return err("invalid-token");
    }

    const { email, name } = token.value;
    if (!email) {
      // wtf did you use to sign in
      return err("invalid-token");
    }

    const [studentId, domain] = email.split("@");

    if (!studentId || !domain) {
      return err("invalid-token");
    }

    if (!domain.endsWith("chula.ac.th")) {
      return err("not-chula");
    }

    const rightVerifyResult = await this.verifyRight(studentId);
    if (rightVerifyResult.isErr()) {
      return rightVerifyResult;
    }

    return ok({ studentId, name });
  }

  async verifyRight(studentId: string) {
    if (studentId.length !== 10) {
      return err("invalid-student-id");
    }

    // xxxxxxxx23 for science students
    if (!/^\d{8}23$/.test(studentId)) {
      return err("not-science-student");
    }

    return ok();
  }
}

export const AuthModel = new Elysia({
  aot: false,
  name: "AuthModel",
}).model({
  UnauthorizedResponse: t.Object(
    {
      error: AuthUnauthorizedError,
    },
    {
      title: "UnauthorizedResponse",
      description:
        "Response when the user is not authenticated or the token is invalid",
    },
  ),
  ForbiddenResponse: t.Object(
    {
      error: AuthForbiddenError,
    },
    {
      title: "ForbiddenResponse",
      description:
        "Response when the user is authenticated but not authorized to access the requested resource",
    },
  ),
  LoginRequestBody: t.Object(
    {
      googleIdToken: t.String(),
    },
    {
      title: "LoginRequestBody",
      description: "Request body for the login endpoint",
    },
  ),
  LoginSuccessResponse: t.Object(
    {
      jwtSessionToken: t.String(),
    },
    {
      title: "Login success",
      description: "Response when the user successfully logs in",
    },
  ),
  MeSuccessResponse: User,
});
