import { err, ok, type Result, ResultAsync } from "neverthrow";
import type { Choice, ElectionResult, Position, Vote } from "./schema";
import { candidates, type OfficialElectionResult } from "@repo/constants";
import { AppEnv } from "../..";

export class ElectionModel {
  constructor(
    public db: AppEnv["DB"],
    public jwtSecret: AppEnv["JWT_SECRET"],
    public kv: AppEnv["KV"],
  ) {}

  async addVotes({
    voterId,
    votes,
    currentTime,
  }: {
    voterId: string;
    votes: Vote[];
    currentTime?: Date;
  }) {
    const now = (currentTime ?? new Date()).toISOString();
    // Materialize eligibility before inserting any rows. The trigger records the
    // voter within this same SQL statement, so no separate read/write can race.
    const statement = this.db.prepare(`
      WITH eligible AS MATERIALIZED (
        SELECT ? AS voterId, ? AS createdAt
        WHERE NOT EXISTS (SELECT 1 FROM voters WHERE studentId = ?)
          AND NOT EXISTS (SELECT 1 FROM ballots WHERE studentIdHash = ?)
      )
      INSERT INTO ballots (id, studentIdHash, position, choice, createdAt)
      SELECT json_extract(value, '$.id'), eligible.voterId,
             json_extract(value, '$.position'), json_extract(value, '$.choice'),
             eligible.createdAt
      FROM eligible CROSS JOIN json_each(?)
      RETURNING id
    `).bind(
      voterId, now, voterId, voterId,
      JSON.stringify(votes.map((vote) => ({ ...vote, id: crypto.randomUUID() }))),
    );

    const result = await ResultAsync.fromPromise(statement.all(), (error) => error);
    if (result.isErr()) {
      console.error(result.error);
      return err("internal-error" as const);
    }
    if (!result.value.success) return err("internal-error" as const);
    if (result.value.results.length === 0) return err("voted-already" as const);
    return ok();
  }

  async isVoted({ voterId }: { voterId: string }) {
    const prepared = this.db
      .prepare("SELECT * FROM ballots WHERE studentIdHash = ?")
      .bind(voterId);

    const result = await ResultAsync.fromPromise(prepared.all(), () => []);

    if (result.isErr()) {
      console.error(result.error);
      return err("internal-error");
    }

    return ok({ isVoted: result.value.results.length > 0 });
  }

  async currentVoterCount() {
    // TODO: Maybe add some cache here (;ater)
    const prepared = this.db.prepare(
      "SELECT COUNT(DISTINCT studentIdHash) as count FROM ballots",
    );

    const result = await ResultAsync.fromPromise(prepared.first(), (e) => e);

    if (result.isErr()) {
      console.error(result.error);
      return err("internal-error");
    }

    return ok({
      count: (result.value?.count as number) || 0,
    });
  }

  private parseDbchoice(dbchoice: string) {
    if (dbchoice === "no-vote") return ok("no-vote" as const);
    if (dbchoice === "disapprove") return ok("disapprove" as const);
    if (!candidates.some((c) => c.candidate_id === dbchoice)) {
      return err("no-candidate-found");
    }

    return ok(dbchoice as (typeof candidates)[number]["candidate_id"]);
  }

  async getTotalVotesCount() {
    const prepared = this.db.prepare(
      "SELECT COUNT(DISTINCT studentIdHash) as total FROM ballots",
    );

    const result = await ResultAsync.fromPromise(prepared.first(), (e) => e);

    if (result.isErr()) {
      console.error(result.error);
      return err("internal-error");
    }

    return ok((result.value?.total as number) || 0);
  }

  async getVoteCountsByCandidate() {
    const prepared = this.db.prepare(
      "SELECT position, choice, COUNT(*) as count FROM ballots GROUP BY position, choice",
    );

    const query = await prepared.all();

    if (query.error) {
      console.error(query.error);
      return err("internal-error");
    }

    const counts = query.results as {
      position: Position;
      choice: string;
      count: number;
    }[];

    const mapped = [] as {
      position: Position;
      choice: Choice;
      count: number;
    }[];

    for (const { choice, count, position } of counts) {
      const parsed = this.parseDbchoice(choice);
      if (parsed.isErr()) {
        return err("internal-error");
      }
      mapped.push({
        choice: parsed.value,
        count,
        position,
      });
    }

    return ok(mapped);
  }

  async getCachedElectionResult() {
    return ResultAsync.fromPromise(
      this.kv.get<ElectionResult>("election-result", "json"),
      () => "internal-error" as const,
    );
  }

  async setCachedElectionResult(electionResult: ElectionResult) {
    // this one will throw if we put the value more than once in 1 second.
    return ResultAsync.fromPromise(
      this.kv.put("election-result", JSON.stringify(electionResult), {
        expirationTtl: 300, // seconds
      }),
      () => "internal-error" as const,
    );
  }
}
