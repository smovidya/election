import { type Static, t } from "elysia";
import { running_positions, candidates } from "@repo/constants";

export const Position = t.Union([
  ...running_positions.map((position) =>
    t.Literal(position.position_id, {
      description: position.name.th,
    }),
  ),
]);
export type Position = Static<typeof Position>;

// const c = t.Union([t.Literal("sd"), t.Literal("as")]);

// export type Position = (typeof electionInfo.positions)[number];

export const Choice = t.Union(
  [
    ...candidates.map((candidate) =>
      t.Literal(candidate.candidate_id, {
        description: `ลงคะแนนให้ ${candidate.full_name} (${candidate.party_id})`,
      }),
    ),
    t.Literal("no-vote", {
      title: "No Vote",
      description:
        "Cast no vote when multiple candidate or not express opinion on one candidate",
    }),
    t.Literal("disapprove", {
      title: "Disapprove",
      description: "Not approve when there is only one candidate",
    }),
  ],
  {
    description:
      'The student ID of the candidate or "no-vote" (cast no vote when multiple candidate) or "disapprove (when there is only one candidate)',
    examples: ["c1", "no-vote", "disapprove"],
  },
);
export type Choice = Static<typeof Choice>;

export const Vote = t.Object({
  choice: Choice,
  position: Position,
});
export type Vote = Static<typeof Vote>;

// const a = t.Record(Position, t.Number());
// const b: Static<typeof a> = {};

export const ElectionResult = t.Object({
  totalVotes: t.Number({
    description: "Total votes casted",
    examples: [123456],
  }),
  votesByPosition: t.Record(Position, t.Record(Choice, t.Number()), {
    description:
      "A record of position and a record of candidate (including `no-vote` and `disapprove`) and their vote count",
    examples: [
      {
        president: {
          "no-vote": 530,
          disapprove: 490,
          c1: 1,
          c2: 1,
        },
        "vice-president": {
          "no-vote": 12,
          disapprove: 34,
          c3: 56,
          c4: 78,
        },
      },
    ],
  }),
});
// typescript cant infer each case of Position as a literal so we need to create this manually
export type ElectionResult = {
  totalVotes: number;
  votesByPosition: Record<Position, Record<Choice, number>>;
};
