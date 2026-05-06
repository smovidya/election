import { running_positions, parties } from "./candidates";

/**
 * a string that only contains letters, underscores, or numbers. This is used for IDs of positions, parties, and candidates.
 * The __brand property is used to make this type incompatible with regular strings, so that you have to explicitly create an AlphaNumericString using a function that checks the format, instead of just using any string.
 */
export type AlphaNumericString = string;

export type SupportedLanguage = "en" | "th";
/**
 * a string that has translations in multiple languages.
 */
export type LocalizedString = {
  [key in SupportedLanguage]?: string;
};

/**
 * a position that candidates can run for. Each position has a unique ID and a name that is localized.
 */
export interface Position {
  position_id: AlphaNumericString;
  name: LocalizedString;
}

export interface Party {
  party_id: AlphaNumericString | "independent";
  name: LocalizedString;
  visions: LocalizedString;
  color: string;
}

export type RunningPositionIDs =
  (typeof running_positions)[number]["position_id"];
export type RunningPartyIDs = (typeof parties)[number]["party_id"];

export interface Candidate {
  candidate_id: AlphaNumericString;
  full_name: string;
  study_year: number;
  study_program: LocalizedString;
  position_id: RunningPositionIDs;
  party_id: RunningPartyIDs;
  personal_vision: LocalizedString;
  personal_mission: LocalizedString;
  personal_experience: LocalizedString;
  image?: string;
}
