import { useEffect, useState, type ReactNode } from "react";
import { api, authHeader } from "@/lib/api";
import { useLocale } from "@/lib/utils";
import {
  getCandidateParty,
  type Candidate,
  type Party,
  type Position,
  type LocalizedString,
} from "@repo/constants";
import { i18n } from "@/lib/i18n";
import { CalendarDays, Clock3 } from "lucide-react";
import AddToCalendar from "./AddToCalendar";
import { electionNow } from "@/lib/clock";
import { APP_ENV } from "astro:env/client";

type CandidateWithImage = Candidate & { imageSrc: string };

interface Props {
  candidatesWithImages: CandidateWithImage[];
  parties: Party[];
  positions: Position[];
  eventName: LocalizedString;
  votingStartString: string;
  votingEndString: string;
  logoSrc: string;
  boxIconSrc: string;
  lineSrc: string;
  resultStatus: "hidden" | "unofficial" | "official";
  children?: ReactNode;
}

type Phase = "before" | "during" | "ended";

interface Countdown {
  phase: Phase;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeCountdown(start: Date, end: Date): Countdown {
  const now = electionNow();
  const target = now < start.getTime() ? start : end;
  const phase: Phase =
    now < start.getTime() ? "before" : now < end.getTime() ? "during" : "ended";

  if (phase === "ended")
    return { phase, days: 0, hours: 0, minutes: 0, seconds: 0 };

  const diff = target.getTime() - now;
  return {
    phase,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function MainCard({
  candidatesWithImages,
  parties,
  positions,
  eventName,
  votingStartString,
  votingEndString,
  logoSrc,
  boxIconSrc,
  lineSrc,
  resultStatus,
  children,
}: Props) {
  const [lang, setLang] = useLocale();
  // Read the browser clock after hydration; SSR cannot see a tab's mock time.
  const [countdown, setCountdown] = useState<Countdown | null>(null);
  const [voterCount, setVoterCount] = useState<number | null>(null);

  const t = i18n[lang];

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (!window) {
      return;
    }
    api.auth.me
      .get({
        headers: authHeader() ?? {},
      })
      .then(({ data }) => {
        setIsLoggedIn(!!data);
      });
  }, []);

  useEffect(() => {
    const start = new Date(votingStartString);
    const end = new Date(votingEndString);
    setCountdown(computeCountdown(start, end));
    const id = setInterval(
      () => setCountdown(computeCountdown(start, end)),
      1000,
    );
    return () => clearInterval(id);
  }, [votingStartString, votingEndString]);

  useEffect(() => {
    api.election["voter-count"]
      .get()
      .then(({ data }) => {
        const count = data?.voterCount.count;
        if (count !== undefined) {
          setVoterCount(count);
        }
      })
      .catch(() => {});
  }, []);

  const isStaging = APP_ENV === "staging";
  const canVote = isStaging || countdown?.phase === "during";
  const showResults = resultStatus !== "hidden" && countdown?.phase === "ended";
  const countdownUnits = countdown
    ? [
        ...(countdown.days > 0
          ? [{ value: countdown.days, label: t.days }]
          : []),
        { value: countdown.hours, label: t.hours },
        { value: countdown.minutes, label: t.minutes },
        { value: countdown.seconds, label: t.seconds },
      ]
    : [];
  const formatVotingDate = (value: string) =>
    new Intl.DateTimeFormat(lang === "th" ? "th-TH" : "en-GB", {
      timeZone: "Asia/Bangkok",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  const formatVotingTime = (value: string) =>
    t.votingTimeStyle.replace(
      "{time}",
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Bangkok",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }).format(new Date(value)),
    );

  return (
    <div className="flex flex-col w-full h-auto bg-yellow select-none">
      {/* Yellow section */}
      <div className="pt-10 mb-10 px-10">
        <div className="flex justify-end mb-4 float-end">
          <button
            className="text-xs font-semibold border border-black/30 rounded-lg px-3 py-1 bg-white/40 hover:bg-white/70 transition"
            onClick={() => setLang(lang === "th" ? "en" : "th")}
          >
            {t.langToggle}
          </button>
        </div>

        <img
          src={logoSrc}
          alt="SMO Election Logo"
          className="w-20 mb-8 pointer-events-none"
        />

        <div className="mb-10">
          <h1 className="font-bold font-noto text-md">{t.eventTitle}</h1>
          <h2 className="font-light font-noto text-md mb-1">
            {t.eventSubtitle}
          </h2>
          <h4 className="font-light font-noto text-xs text-lgray">
            {eventName[lang] ?? eventName.th ?? ""}
          </h4>
        </div>

        {/* Countdown */}
        {!showResults && <section className="w-full overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-lg">
          <div className="px-4 py-5 text-center">
            <h2 className="mb-4 flex items-center justify-center gap-2 text-sm font-medium text-lgray">
              <Clock3 size={16} aria-hidden="true" />
              {isStaging
                ? t.stagingVotingOpen
                : !countdown
                ? t.loading
                : countdown.phase === "before"
                  ? t.countdownBefore
                  : canVote
                    ? t.countdownDuring
                    : t.countdownEnded}
            </h2>
            {!isStaging && countdown && countdown.phase !== "ended" && (
              <div
                role="timer"
                aria-live="off"
                className={`grid gap-2 ${countdown.days > 0 ? "grid-cols-4" : "grid-cols-3"}`}
              >
                {countdownUnits.map(({ value, label }) => (
                  <div key={label} className="min-w-0 px-1 py-3">
                    <div className="text-2xl font-semibold leading-none tabular-nums text-black sm:text-3xl">
                      {pad(value)}
                    </div>
                    <div className="mt-2 text-xs font-medium text-lgray">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3 bg-secondary/50 px-4 py-4">
            <CalendarDays
              size={18}
              className="mt-0.5 shrink-0 text-dgray"
              aria-hidden="true"
            />
            <div className="min-w-0 text-xs text-lgray">
              <AddToCalendar
                name={eventName}
                start={votingStartString}
                end={votingEndString}
              />
              <time
                dateTime={votingStartString}
                className="block font-medium text-black"
              >
                {formatVotingDate(votingStartString)}{" "}
                {formatVotingTime(votingStartString)}
              </time>
              <p className="mt-2">
                {t.votingEnds}:{" "}
                <time dateTime={votingEndString}>
                  {formatVotingDate(votingEndString)}{" "}
                  {formatVotingTime(votingEndString)}
                </time>
              </p>
              <p className="mt-1">{t.bangkokTime}</p>
            </div>
          </div>
        </section>}
      </div>

      {/* White section */}
      <div className="flex flex-col w-full rounded-t-4xl bg-white items-center pt-13 px-10">
        {/* Keep the nested Astro island mounted while the election phase changes. */}
        <div className="w-full" hidden={!showResults}>{children}</div>

        {!showResults && <>
        {/* Vote button */}
        <span className="font-semibold font-noto text-md text-dgray mb-3">
          {t.voteLabel}
        </span>
        <a
          href={isLoggedIn ? "/agreement" : "/login"}
          className={`px-12 py-3 rounded-2xl shadow-lg inline-flex items-center gap-2 ${
            canVote
              ? "cursor-pointer bg-yellow"
              : "pointer-events-none opacity-50"
          }`}
        >
          <img src={boxIconSrc} alt="" className="w-7 pointer-events-none" />
          <span className="font-semiboldtext-sm text-black">{t.voteBtn}</span>
        </a>

        <img
          src={lineSrc}
          alt=""
          className="w-full my-10 pointer-events-none"
        />

        {/* Voter count */}
        <div className="flex flex-col items-center">
          <span className="font-noto text-dgray text-center text-md mb-2">
            {t.totalVoters}
          </span>
          <span className="text-center text-dgray text-4xl mb-2">
            {voterCount !== null
              ? voterCount.toLocaleString() + t.voterSuffix
              : "..."}
          </span>
          {/* <span className="font-noto text-dgray text-center text-sm">
            {t.eligibleVoters}
          </span> */}
        </div>

        <img
          src={lineSrc}
          alt=""
          className="w-full my-10 pointer-events-none"
        />

        </>}

        {/* Party policies */}
        {parties.length > 0 && (
          <div className="w-full flex flex-col shadow-lg rounded-xl py-7 px-5 font-noto mb-5">
            {parties.map((party) => (
              <div key={party.party_id}>
                <h1 className="text-md text-center font-semibold text-black mb-2">
                  {t.policiesTitle} {party.name[lang] ?? party.name.th}
                </h1>
                <p className="text-xs text-lgray font-light leading-relaxed whitespace-pre-line">
                  {party.visions[lang] ?? party.visions.th}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Candidates */}
        <div className="flex flex-col items-center w-full px-3">
          <div className="flex flex-col items-center mt-5 mb-5">
            <h3 className="font-bold font-noto text-md text-dgray mb-1">
              {t.candidatesTitle}
            </h3>
            <h4 className="font-light font-noto text-sm text-dgray">
              {t.candidatesHint}
            </h4>
          </div>
          <div className="w-full">
            {candidatesWithImages.map((candidate, idx) => {
              const party = getCandidateParty(candidate, parties);
              const position = positions.find(
                (p) => p.position_id === candidate.position_id,
              );
              return (
                <a
                  key={candidate.candidate_id}
                  href={`/candidates/${candidate.candidate_id}`}
                  className="flex flex-row w-full justify-between gap-1 my-5 h-25"
                >
                  <div
                    className="w-20 h-full flex flex-col justify-center text-center shrink-0"
                    style={{
                      backgroundColor:
                        candidate.color ?? party?.color ?? "#6b7280",
                    }}
                  >
                    <span className="font-semibold text-[0.625rem] leading-tight text-white">
                      {t.numberLabel}
                    </span>
                    <span className="text-5xl font-normal text-white">
                      {candidate.candidate_number ?? idx + 1}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-row items-center justify-between bg-[#F3F3F3] min-w-0">
                    <div className="pl-3 pr-2 min-w-0">
                      <p className="font-noto font-semibold text-xs text-lgray">
                        {candidate.full_name}
                      </p>
                      <p className="font-noto text-xs text-lgray truncate">
                        {party?.name[lang] ??
                          party?.name.th ??
                          t.independentCandidate}
                      </p>
                      <p className="font-noto font-normal text-md text-lgray whitespace-pre-line">
                        {position?.name[lang] ?? position?.name.th}
                      </p>
                      <p className="font-noto text-xs text-lgray">
                        {t.yearLabel} {candidate.study_year}
                      </p>
                    </div>
                    {candidate.imageSrc && (
                      <img
                        src={candidate.imageSrc}
                        alt={candidate.full_name}
                        className="h-full w-auto object-contain ml-auto pointer-events-none shrink-0"
                      />
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
}
