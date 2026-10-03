import type { Candidate, Party } from "./types";

/** Independent candidates do not need an entry in the party list. */
export function getCandidateParty(
  candidate: Candidate,
  parties: readonly Party[],
): Party | undefined {
  if (!candidate.party_id || candidate.party_id === "independent") {
    return undefined;
  }
  return parties.find((party) => party.party_id === candidate.party_id);
}
