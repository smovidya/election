import { useState } from "react";
import type { Candidate, Position, SupportedLanguage } from "@repo/constants";

interface Props {
  candidate: Candidate;
  position: Position;
  imageSrc?: string;
}

const i18n = {
  th: {
    langToggle: "EN",
    candidateFor: "ผู้สมัครตำแหน่ง",
    year: "ชั้นปีที่",
    missionTitle: "นโยบายผู้สมัคร",
    experienceTitle: "ประวัติการทำงานของผู้สมัคร",
  },
  en: {
    langToggle: "TH",
    candidateFor: "Candidate for",
    year: "Year",
    missionTitle: "Candidate Policies",
    experienceTitle: "Candidate's Work History",
  },
} as const;

export default function CandidateCard({ candidate, position, imageSrc }: Props) {
  const [lang, setLang] = useState<SupportedLanguage>("th");
  const t = i18n[lang];

  const positionName = position?.name[lang] ?? position?.name.th ?? "";
  const studyProgram = candidate.study_program[lang] ?? candidate.study_program.th ?? "";
  const mission = candidate.personal_mission[lang] ?? candidate.personal_mission.th ?? "";
  const experience = candidate.personal_experience[lang] ?? candidate.personal_experience.th ?? "";

  return (
    <>
      <div className="w-full bg-yellow pt-12 pb-24">
        <div className="w-full max-w-3xl mx-auto px-8 sm:px-12">
          <div className="flex justify-between items-center mb-4">
            <a href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
                <path d="M9 14 4 9l5-5" />
              </svg>
            </a>
            <button
              className="text-xs font-semibold border border-black/30 rounded-lg px-3 py-1 bg-white/40 hover:bg-white/70 transition"
              onClick={() => setLang((l) => (l === "th" ? "en" : "th"))}
            >
              {t.langToggle}
            </button>
          </div>
          <div className="flex flex-row items-center w-full gap-x-8">
            <div className="flex flex-col">
              <h1 className="font-bold font-noto text-lg leading-tight">
                {candidate?.full_name}
              </h1>
              <div className="font-light font-noto text-darkgray text-xs">
                {t.candidateFor} {positionName}
              </div>
              <div className="font-light font-noto text-darkgray text-xs mb-2">
                {studyProgram} {t.year} {candidate.study_year}
              </div>
            </div>
            <div className="relative w-32 mt-0 mb-8 shrink-0">
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt={candidate?.full_name}
                  className="w-full"
                  style={{ objectPosition: "top" }}
                />
              )}
              <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-transparent to-yellow/20 rounded-tr-[2.5rem]" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto bg-white rounded-t-[2.5rem] pt-8 pb-8 -mt-24 px-8 sm:px-12">
        {imageSrc && (
          <img
            src={imageSrc}
            alt={candidate.full_name}
            className="w-full rounded-2xl object-cover object-top mb-6"
            style={{ maxHeight: "320px" }}
          />
        )}
        <h2 className="font-bold font-noto text-lg mb-4">{t.missionTitle}</h2>
        <div className="font-noto text-sm text-black leading-relaxed space-y-4">
          {mission.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        <div className="border-t border-black w-full my-6" />
        <h2 className="font-bold font-noto text-base leading-tight mb-4">
          {t.experienceTitle}
        </h2>
        <div className="space-y-3 text-sm font-noto">
          {experience.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
    </>
  );
}
