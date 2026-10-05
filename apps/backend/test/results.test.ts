import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { env } from "cloudflare:workers";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import { createApp } from "@repo/api";
import { event, type OfficialElectionResult } from "../../../packages/constants/src";

const config = vi.hoisted(() => ({
  status: "unofficial" as "hidden" | "unofficial" | "official",
  official: { totalVotes: 0, votesByPosition: [] } as OfficialElectionResult,
}));
vi.mock("../../../packages/constants/src", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../packages/constants/src")>();
  return { ...actual, event: {
    ...actual.event,
    get resultStatus() { return config.status; },
    get officialElectionResult() { return config.official; },
  } };
});
vi.stubGlobal("Function", new Proxy(globalThis.Function, {
  apply(target, _this, args) { return Reflect.construct(target, args); },
}));
afterAll(() => vi.unstubAllGlobals());

async function resultAt(now: Date) {
  return createApp(CloudflareAdapter, {
    isDev: false, DB: env.DB, KV: env.KV as never,
    JWT_SECRET: "test", now: () => now,
  }).compile().handle(new Request("http://localhost/election/result"));
}

beforeEach(async () => {
  config.status = "unofficial";
  config.official = { totalVotes: 0, votesByPosition: [] };
  await env.KV.delete("election-result");
  await env.DB.exec("CREATE TABLE IF NOT EXISTS ballots (id TEXT PRIMARY KEY, studentIdHash TEXT NOT NULL, position TEXT NOT NULL, choice TEXT NOT NULL, createdAt TEXT NOT NULL); DELETE FROM ballots;");
  await env.DB.prepare("INSERT INTO ballots VALUES (?, ?, ?, ?, ?)")
    .bind("test-ballot", "voter", "vp2", "c1", event.votingStart.toISOString()).run();
});

describe("published election results", () => {
  it.each(["hidden", "unofficial", "official"] as const)("keeps %s results inaccessible before closing", async status => {
    config.status = status;
    const response = await resultAt(new Date(event.votingEnd.getTime() - 1));
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "election-not-ended" });
  });
  it("rejects hidden results after closing", async () => {
    config.status = "hidden";
    const response = await resultAt(event.votingEnd);
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "announcement-not-started" });
  });
  it("publishes the database tally at closing in unofficial mode", async () => {
    const response = await resultAt(event.votingEnd);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ totalVotes: 1, votesByPosition: { vp2: { c1: 1, c2: 0, c3: 0, "no-vote": 0 } } });
  });
  it("uses certified totals even when an unofficial result is cached", async () => {
    expect((await resultAt(event.votingEnd)).status).toBe(200);
    config.status = "official";
    config.official = { totalVotes: 10, votesByPosition: [{
      position_id: "vp2", votesByChoice: [
        { choice: "c1", count: 4 }, { choice: "c2", count: 3 },
        { choice: "c3", count: 2 }, { choice: "no-vote", count: 1 },
        { choice: "disapprove", count: 0 },
      ],
    }] };
    const response = await resultAt(event.votingEnd);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ totalVotes: 10, votesByPosition: { vp2: { c1: 4, c2: 3, c3: 2, "no-vote": 1, disapprove: 0 } } });
  });
  it("rejects the unfilled official-result placeholder", async () => {
    config.status = "official";
    const response = await resultAt(event.votingEnd);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "official-result-not-configured" });
  });
});
