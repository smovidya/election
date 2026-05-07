import { useState } from "react";
import type { Candidate, Position, SupportedLanguage } from "@repo/constants";
import { CornerDownLeft } from "lucide-react";

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

export default function CandidateCard({
	candidate,
	position,
	imageSrc,
}: Props) {
	const [lang, setLang] = useState<SupportedLanguage>("th");
	const t = i18n[lang];

	const positionName = position?.name[lang] ?? position?.name.th ?? "";
	const studyProgram =
		candidate.study_program[lang] ?? candidate.study_program.th ?? "";
	const mission =
		candidate.personal_mission[lang] ?? candidate.personal_mission.th ?? "";
	const experience =
		candidate.personal_experience[lang] ??
		candidate.personal_experience.th ??
        "";

    const processedImageSrc = imageSrc
    ? imageSrc.split(".")[0] + "_remove.png"
    : undefined;
	return (
		<>
			<div className="w-full bg-yellow pt-12 pb-24 ">
				<div className="w-full max-w-3xl mx-auto px-8 sm:px-12">
					<div className="flex justify-between items-center mb-4 relative z-100">
						<a href="/">
							<CornerDownLeft />
						</a>
						<button
							className="text-xs font-semibold border border-black/30 rounded-lg px-3 py-1 bg-white/40 hover:bg-white/70 transition"
							onClick={() => setLang((l) => (l === "th" ? "en" : "th"))}
						>
							{t.langToggle}
						</button>
					</div>
					<div className="flex flex-row items-center w-full pb-2 h-40 relative">
						<div className="flex flex-col max-w-54 ">
							<h1 className="font-bold font-noto text-2xl leading-tight mb-2">
								{candidate?.full_name}
							</h1>
							<div className="font-light font-noto text-darkgray text-xs">
								{t.candidateFor} :
                            </div>
                            <div className="font-bold font-noto text-darkgray text-sm mb-1">
								{positionName}
							</div>
							<div className="font-light font-noto text-darkgray text-xs">
								{studyProgram} <br/> {t.year} {candidate.study_year}
							</div>
						</div>
						<div className="absolute -right-10 -bottom-10 w-50 mt-0 shrink-0 z-2">
							{imageSrc && (
								<img
									src={processedImageSrc}
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
				{/*{imageSrc && (
					<img
						src={imageSrc}
						alt={candidate.full_name}
						className="w-full rounded-2xl object-cover object-top mb-6"
						style={{ maxHeight: "320px" }}
					/>
				)}*/}
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
