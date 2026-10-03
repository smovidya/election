import type {
  Candidate,
  Position,
  Party,
} from "@repo/constants";
import { CornerDownLeft } from "lucide-react";
import { useLocale } from "@/lib/utils";
import { getCandidateParty } from "@repo/constants";
import { getAccessibleColors } from "@/lib/contrast";

interface Props {
  candidate: Candidate;
  position: Position;
  imageSrc?: string;
  party?: Party;
}

const i18n = {
  th: {
    langToggle: "EN",
    back: "กลับหน้าหลัก",
    switchLanguage: "Switch to English",
    candidateFor: "ผู้สมัครตำแหน่ง",
    year: "ชั้นปีที่",
    missionTitle: "นโยบายผู้สมัคร",
    visionTitle: "วิสัยทัศน์ผู้สมัคร",
    experienceTitle: "ประวัติการทำงานของผู้สมัคร",
  },
  en: {
    langToggle: "TH",
    back: "Back to home",
    switchLanguage: "เปลี่ยนเป็นภาษาไทย",
    candidateFor: "Candidate for",
    year: "Year",
    missionTitle: "Candidate Policies",
    visionTitle: "Candidate Vision",
    experienceTitle: "Candidate's Work Experience",
  },
} as const;

export default function CandidateCard({
  candidate,
  position,
  imageSrc,
  party,
}: Props) {
  const [lang, setLang] = useLocale();
  const t = i18n[lang];

  const positionName = position?.name[lang] ?? position?.name.th ?? "";
  const studyProgram =
    candidate.study_program[lang] ?? candidate.study_program.th ?? "";
  const mission =
    candidate.personal_mission[lang] ?? candidate.personal_mission.th ?? "";
  const vision =
    candidate.personal_vision[lang] ?? candidate.personal_vision.th ?? "";
  const experience =
    candidate.personal_experience[lang] ??
    candidate.personal_experience.th ??
    "";
  const candidateParty = getCandidateParty(candidate, party ? [party] : []);
  const partyColor = candidate.color ?? candidateParty?.color;
  const headerColors = getAccessibleColors(partyColor);
  return (
    <>
      <div
        style={{ backgroundColor: headerColors.backgroundColor }}
        className={`w-full pt-12 pb-24 ${headerColors.textClass}`}
      >
        <div className="w-full max-w-3xl mx-auto px-8 sm:px-12">
          <div className="flex justify-between items-center mb-4 relative z-100">
            <a
              href="/"
              aria-label={t.back}
              className="rounded-lg p-1 focus-visible:outline-2 flex flex-row focus-visible:outline-offset-4 focus-visible:outline-current"
            >
              <CornerDownLeft />
            </a>
          </div>
          <div className="flex flex-row items-center w-full pb-2 h-40 relative">
            <div className="flex flex-col max-w-54 ">
              <h1 className="font-bold font-noto text-2xl leading-tight mb-2">
                {candidate?.full_name}
              </h1>
              <div className="font-light font-noto text-xs">
                {t.candidateFor}:
              </div>
              <div className="font-bold font-noto text-sm mb-1">
                {positionName}
              </div>
              <div className="font-light font-noto text-xs">
                {studyProgram} <br /> {t.year} {candidate.study_year}
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-50 mt-0 shrink-0 z-2">
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt={candidate?.full_name}
                  className="w-full -translate-y-2"
                  style={{ objectPosition: "top" }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto bg-white rounded-t-[2.5rem] pt-8 pb-8 -mt-24 px-8 sm:px-12 relative z-10">
        <div className="float-end flex justify-end mb-6">
          <button
            type="button"
            aria-label={t.switchLanguage}
            className="text-xs font-semibold text-black border border-border rounded-lg px-3 py-2 bg-secondary hover:bg-yellow/20 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            onClick={() => setLang(lang === "th" ? "en" : "th")}
          >
            {t.langToggle}
          </button>
        </div>
        {/*{imageSrc && (
					<img
						src={imageSrc}
						alt={candidate.full_name}
						className="w-full rounded-2xl object-cover object-top mb-6"
						style={{ maxHeight: "320px" }}
					/>
				)}*/}
        {vision && (
          <>
            <h2 className="font-bold font-noto text-lg mb-4">
              {t.visionTitle}
            </h2>
            <div className="font-noto text-sm text-black leading-relaxed space-y-4">
              {vision.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <div className="border-t border-black w-full my-6" />
          </>
        )}
        <h2 className="font-bold font-noto text-lg mb-4">{t.missionTitle}</h2>
        <div className="font-noto text-sm text-black leading-relaxed space-y-4">
          {mission.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {experience && (
          <>
            <div className="border-t border-black w-full my-6" />
            <h2 className="font-bold font-noto text-lg leading-tight mb-4">
              {t.experienceTitle}
            </h2>
            <div className="space-y-3 text-sm font-noto">
              {experience.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
