import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { env } from "cloudflare:workers";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import { createApp } from "@repo/api";
import { event, running_positions } from "../../../packages/constants/src";

const before = new Date(event.votingStart.getTime() - 1000);
const student = { studentId: "6930000023", studentName: "Test voter A" };
const votes = running_positions.map(({ position_id }) => ({
	position: position_id,
	choice: "no-vote",
}));

// The Workers pool patches `new Function`, while Elysia calls `Function()`.
// Forward calls through the pool's allowed constructor for runtime compilation.
vi.stubGlobal(
	"Function",
	new Proxy(globalThis.Function, {
		apply(target, _this, args) {
			return Reflect.construct(target, args);
		},
	}),
);
afterAll(() => vi.unstubAllGlobals());

function app(isDev = true, now = before) {
	return createApp(CloudflareAdapter, {
		isDev,
		DB: env.DB,
		// Worker runtime types and @cloudflare/workers-types use different KV declarations.
		KV: env.KV as never,
		JWT_SECRET: "local-test-secret",
		now: () => now,
	}).compile();
}

type TestApp = ReturnType<typeof app>;
function request(
	instance: TestApp,
	path: string,
	body?: unknown,
	headers: Record<string, string> = {},
) {
	return instance.handle(
		new Request(`http://localhost${path}`, {
			method: body === undefined ? "GET" : "POST",
			headers: { "Content-Type": "application/json", ...headers },
			body: body === undefined ? undefined : JSON.stringify(body),
		}),
	);
}
async function login(instance: TestApp, user = student) {
	const response = await request(instance, "/auth/dev-login", user);
	expect(response.status).toBe(200);
	const { jwtSessionToken } = (await response.json()) as {
		jwtSessionToken: string;
	};
	return { Authorization: `Bearer ${jwtSessionToken}` };
}

beforeEach(async () => {
	await env.DB.exec(
		"CREATE TABLE IF NOT EXISTS ballots (id TEXT PRIMARY KEY, studentIdHash TEXT NOT NULL, position TEXT NOT NULL, choice TEXT NOT NULL, createdAt TEXT NOT NULL); CREATE TABLE IF NOT EXISTS voters (studentId TEXT PRIMARY KEY, createdAt TEXT NOT NULL); DELETE FROM ballots; DELETE FROM voters;",
	);
});

describe("development mocks", () => {
	it("switches users with real sessions, unaffected by election time", async () => {
		const instance = app();
		for (const user of [
			student,
			{ studentId: "6930000123", studentName: "Test voter B" },
		]) {
			const headers = await login(instance, user);
			const me = await request(instance, "/auth/me", undefined, {
				...headers,
				"X-Dev-Time": "2000-01-01T00:00:00Z",
			});
			expect(me.status).toBe(200);
			expect(await me.json()).toMatchObject(user);
		}
		expect((await request(instance, "/auth/me")).status).toBe(401);
	});

	it("keeps opening/closing boundaries and stores the mocked ballot time", async () => {
		const instance = app();
		const headers = await login(instance);
		const cast = (time: string) =>
			request(
				instance,
				"/election/cast-vote",
				{ votes },
				{ ...headers, "X-Dev-Time": time },
			);
		expect(await (await cast(before.toISOString())).json()).toEqual({
			error: "election-not-started",
		});
		expect(await (await cast(event.votingEnd.toISOString())).json()).toEqual({
			error: "election-ended",
		});
		expect(await (await cast(event.votingStart.toISOString())).json()).toEqual({
			success: true,
		});
		expect(
			await env.DB.prepare("SELECT createdAt FROM ballots LIMIT 1").first(
				"createdAt",
			),
		).toBe(event.votingStart.toISOString());
		expect(
			await env.DB.prepare("SELECT createdAt FROM voters LIMIT 1").first(
				"createdAt",
			),
		).toBe(event.votingStart.toISOString());
		expect(await (await cast(event.votingStart.toISOString())).json()).toEqual({
			error: "voted-already",
		});
		const other = await login(instance, {
			studentId: "6930000123",
			studentName: "Test voter B",
		});
		expect(
			await (
				await request(instance, "/election/eligibility", undefined, other)
			).json(),
		).toMatchObject({ eligible: true });
	});

	it("falls back to the injected clock for missing, invalid, or timezone-free overrides", async () => {
		const instance = app();
		const headers = await login(instance);
		for (const value of [undefined, "invalid", "2026-10-05T12:00:00"]) {
			const response = await request(
				instance,
				"/election/cast-vote",
				{ votes },
				{
					...headers,
					...(value ? { "X-Dev-Time": value } : {}),
				},
			);
			expect(await response.json()).toEqual({ error: "election-not-started" });
		}
	});

	it("disables dev login and ignores time overrides outside development", async () => {
		const instance = app(false);
		expect((await request(instance, "/auth/dev-login", student)).status).toBe(
			404,
		);
		// A token from the same issuer/secret remains an ordinary JWT.
		const headers = await login(app());
		const response = await request(
			instance,
			"/election/cast-vote",
			{ votes },
			{ ...headers, "X-Dev-Time": event.votingStart.toISOString() },
		);
		expect(await response.json()).toEqual({ error: "election-not-started" });
	});

	it("rejects invalid mock identities", async () => {
		const instance = app();
		expect(
			(
				await request(instance, "/auth/dev-login", {
					...student,
					studentId: "6930000021",
				})
			).status,
		).toBe(422);
		expect(
			(
				await request(instance, "/auth/dev-login", {
					...student,
					studentName: "",
				})
			).status,
		).toBe(422);
	});
});
