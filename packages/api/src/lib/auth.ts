import { AppEnv, Params } from "..";
import Elysia, { type Static, t } from "elysia";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { type Result, ResultAsync, err, ok } from "neverthrow";

const GOOGLE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);
const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];

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
    const token = await ResultAsync.fromPromise(
      jwtVerify(idToken, GOOGLE_JWKS, {
        issuer: GOOGLE_ISSUERS,
        audience: this.env.GOOGLE_CLIENT_ID!,
      }),
      (e) => e,
    );

    if (token.isErr()) {
      console.error("Failed to verify ID token", token.error);
      return err("invalid-token");
    }

    const { email, name } = token.value.payload as { email?: string; name?: string };
    if (!email) {
      console.error("Email not found in token", token.value);
      // wtf did you use to sign in
      return err("invalid-token");
    }

    const [studentId, domain] = email.split("@");

    if (!studentId || !domain) {
      console.error("Invalid email format", email);
      return err("invalid-token");
    }

    if (!domain.endsWith("student.chula.ac.th")) {
      console.error("Email domain is not student.chula.ac.th", email);
      return err("not-chula");
    }

    const rightVerifyResult = await this.verifyRight(studentId);
    if (rightVerifyResult.isErr()) {
      console.log("User does not have the right to access the system", email, rightVerifyResult.error);
      return rightVerifyResult;
    }

    return ok({ studentId, name });
  }

  async verifyRight(studentId: string) {
    if (studentId.length !== 10) {
      console.error("Student ID does not have 10 characters", studentId);
      return err("invalid-student-id");
    }

    // xxxxxxxx23 for science students
    if (!/^\d{8}23$/.test(studentId)) {
      console.error("Student ID does not match the pattern for science students", studentId); 
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
