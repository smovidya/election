import { use, useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  event,
  type Candidate,
  type Party,
  type Position,
  type SupportedLanguage,
} from "@repo/constants";
import { i18n } from "@/lib/i18n";

type CandidateWithImage = Candidate & { imageSrc: string; };

interface Props {
  candidatesWithImages: CandidateWithImage[];
  parties: Party[];
  positions: Position[];
  eventName: string;
  votingStartString: string;
  votingEndString: string;
  logoSrc: string;
  boxIconSrc: string;
  lineSrc: string;
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
  const now = Date.now();
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
}: Props) {
  const [lang, setLang] = useState<SupportedLanguage>("th");
  const [countdown, setCountdown] = useState<Countdown>(() =>
    computeCountdown(new Date(votingStartString), new Date(votingEndString)),
  );
  const [voterCount, setVoterCount] = useState<number | null>(null);

  const t = i18n[lang];

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (!window) {
      return;
    }
    api.auth.me.get()
      .then(({ data }) => {
        setIsLoggedIn(!!data);
      });
  }, []);

  useEffect(() => {
    const start = new Date(votingStartString);
    const end = new Date(votingEndString);
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
        // Eden may infer either voterCount or count depending on schema resolution
        const count = (data as Record<string, unknown>)?.voterCount as
          | number
          | undefined;
        if (typeof count === "number") setVoterCount(count);
      })
      .catch(() => { });
  }, []);

  const partyMap = Object.fromEntries(parties.map((p) => [p.party_id, p]));
  const canVote = countdown.phase === "during";

  return (
    <div className="flex flex-col w-full h-auto bg-yellow select-none">
      {/* Yellow section */}
      <div className="pt-10 mb-10 px-10">
        <div className="flex justify-end mb-4">
          <button
            className="text-xs font-semibold border border-black/30 rounded-lg px-3 py-1 bg-white/40 hover:bg-white/70 transition"
            onClick={() => setLang((l) => (l === "th" ? "en" : "th"))}
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
            {lang === "th" ? eventName : "Academic Year 2026"}
          </h4>
        </div>

        {/* Countdown */}
        <div className="w-full rounded-2xl shadow-lg bg-white py-5 px-4">
          <div className="text-center text-black">
            <h2 className="font-noto text-sm font-light mb-3 text-lgray">
              {countdown.phase === "before"
                ? t.countdownBefore
                : countdown.phase === "during"
                  ? t.countdownDuring
                  : t.countdownEnded}
            </h2>
            {countdown.phase !== "ended" && (
              <div className="flex justify-center items-center space-x-4">
                {countdown.days > 0 ? (
                  <div className="text-center">
                    <div className="text-5xl font-semibold w-15 tabular-nums">
                      {pad(countdown.days)}
                    </div>
                    <div className="text-xl uppercase mt-1">{t.days}</div>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="text-5xl font-semibold w-15 tabular-nums">
                        {pad(countdown.hours)}
                      </div>
                      <div className="text-xl uppercase mt-1">{t.hours}</div>
                    </div>
                    <div className="text-3xl font-semibold">:</div>
                    <div className="text-center">
                      <div className="text-5xl font-semibold w-15 tabular-nums">
                        {pad(countdown.minutes)}
                      </div>
                      <div className="text-xl uppercase mt-1">{t.minutes}</div>
                    </div>
                    <div className="text-3xl font-semibold">:</div>
                    <div className="text-center">
                      <div className="text-5xl font-semibold w-15 tabular-nums">
                        {pad(countdown.seconds)}
                      </div>
                      <div className="text-xl uppercase mt-1">{t.seconds}</div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* White section */}
      <div className="flex flex-col w-full rounded-t-4xl bg-white items-center pt-13 px-10">
        {/* Vote button */}
        <span className="font-semibold font-noto text-md text-dgray mb-3">
          {t.voteLabel}
        </span>
        <a
          href={isLoggedIn ? "/election" : "/login"}
          className={`px-12 py-3 rounded-2xl shadow-lg inline-flex items-center gap-2 ${canVote
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
          <span className="font-noto text-dgray text-center text-sm">
            {t.eligibleVoters}
          </span>
        </div>

        <img
          src={lineSrc}
          alt=""
          className="w-full my-10 pointer-events-none"
        />

        {/* Party policies */}
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
              const party = partyMap[candidate.party_id];
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
                    style={{ backgroundColor: party?.color ?? "#e5e7eb" }}
                  >
                    <span className="font-semibold text-[0.625rem] leading-tight text-white">
                      {t.numberLabel}
                    </span>
                    <span className="text-5xl font-normal text-white">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-row items-center justify-between bg-[#F3F3F3] min-w-0">
                    <div className="pl-3 pr-2 min-w-0">
                      <p className="font-noto text-xs text-lgray truncate">
                        {party?.name[lang] ?? party?.name.th}
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
