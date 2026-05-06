export const full_name =
  "การเลือกตั้งซ่อมคณะกรรมการบริหารสโมสรนิสิต คณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย ประจำปีการศึกษา 2569";

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
export const votingStartString = "2026-05-08T07:00:00+07:00";
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
export const votingEndString = "2026-05-15T17:00:00+07:00";
export const votingEnd = new Date(votingEndString);

export const isResultAnnounced = false;
