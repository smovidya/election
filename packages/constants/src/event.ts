import { OfficialElectionResult } from "./types";

export const full_name = {
  th: "การเลือกตั้งซ่อมคณะกรรมการบริหารสโมสรนิสิต ตำแหน่งอุปนายกคนที่ 2 คณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย ประจำปีการศึกษา 2569",
  en: "By-election for the Student Union Executive Committee, 2nd Vice President, Faculty of Science, Chulalongkorn University, Academic Year 2026",
};
export const short_name = {
  th: "การเลือกตั้งซ่อมอุปนายก 2 สโม 69",
  en: "By-election of VP2, SUCU 2026",
}

export const description = {
  th: "การเลือกตั้งซ่อมคณะกรรมการบริหารสโมสรนิสิต ตำแหน่งอุปนายกคนที่ 2 คณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย ประจำปีการศึกษา 2569 จะจัดขึ้นเพื่อเลือกตั้งคณะกรรมการบริหารสโมสรนิสิตในตำแหน่งตำแหน่งอุปนายกคนที่ 2 ที่ยังว่างอยู่",
  en: "The by-election for the Student Union Executive Committee, 2nd Vice President, Faculty of Science, Chulalongkorn University, Academic Year 2026 is held to elect a new Vice President 2 to fill the vacant position in the Student Union Executive Committee.",
};
// export const eligibleVoters = 3001;

/**
 * The date and time when the voting starts, in ISO 8601 format.
 * The format is "YYYY-MM-DDTHH:mm:ss±hh:mm", where:
 * - YYYY is the year
 * - MM is the month (01-12)
 * - DD is the day of the month (01-31)
 * - T separates the date and time
 * - HH is the hour (00-23)
 * - mm is the minute (00-59)
 * - ss is the second (00-59)
 * - ±hh:mm is the time zone offset from UTC (e.g., +07:00 for UTC+7 aka Bangkok time)
 */
export const votingStartString = "2026-10-05T07:00:00+07:00";
export const votingStart = new Date(votingStartString);

/**
 * The date and time when the voting ends, in ISO 8601 format.
 * The format is "YYYY-MM-DDTHH:mm:ss±hh:mm", where:
 * - YYYY is the year
 * - MM is the month (01-12)
 * - DD is the day of the month (01-31)
 * - T separates the date and time
 * - HH is the hour (00-23)
 * - mm is the minute (00-59)
 * - ss is the second (00-59)
 * - ±hh:mm is the time zone offset from UTC (e.g., +07:00 for UTC+7 aka Bangkok time)
 */
export const votingEndString = "2026-10-05T17:00:00+07:00";
export const votingEnd = new Date(votingEndString);

/** Redeploy both apps after changing the result status. */
export const resultStatus: "hidden" | "unofficial" | "official" = "unofficial";

/** Certified counts used only when resultStatus is "official". */

export const officialElectionResult: OfficialElectionResult = {
  totalVotes: 0,
  votesByPosition: [],
} satisfies OfficialElectionResult;
