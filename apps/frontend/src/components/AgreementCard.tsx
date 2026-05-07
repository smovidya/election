import { useEffect, useState } from "react";
import { api, authHeader } from "@/lib/api";
import type {
	Candidate,
	Party,
	Position,
	SupportedLanguage,
} from "@repo/constants";

type CandidateWithImage = Candidate & { imageSrc: string; };

interface Props {
	candidatesWithImages: CandidateWithImage[];
	parties: Party[];
	positions: Position[];
	eventName: string;
	votingStartString: string;
	votingEndString: string;
}

const i18n = {
	th: {
		langToggle: "EN",
		eventLabel: "การเลือกตั้ง",
		votingPeriod: "ช่วงเวลาการลงคะแนน",
		to: "ถึง",
		studentId: "รหัสนิสิต",
		name: "ชื่อ-นามสกุล",
		dataUnavailable: "ข้อมูลไม่พร้อมใช้งาน",
		loading: "กำลังโหลด...",
		candidatesTitle: "รายชื่อผู้สมัคร",
		year: "ปีที่",
		termsTitle: "ข้อกำหนดและเงื่อนไข",
		terms: [
			"ขณะนี้ท่านกำลังใช้งานเว็บไซต์และมองหน้าจอเพียงบุคคลเดียว โดยมิได้ถูกบังคับ ข่มเหงหรือชักจูงจากใครในการลงคะแนนเสียงเลือกตั้ง",
			"ข้อมูลส่วนบุคคลของท่านถูกต้องทั้งหมด",
			"ท่านมีเวลาทั้งสิ้น 30 นาที ในการเข้าสู่ระบบเพื่อทำการลงคะแนนเสียงจนเสร็จสิ้น",
			"ท่านยอมรับคะแนนเสียงที่โหวตผ่านเว็บไซต์ เลือกตั้ง คณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย ให้ถือเป็นที่สิ้นสุด",
		],
		acceptButton: "ยอมรับข้อกำหนดและเงื่อนไข",
	},
	en: {
		langToggle: "TH",
		eventLabel: "Election",
		votingPeriod: "Voting Period",
		to: "to",
		studentId: "Student ID",
		name: "Full Name",
		dataUnavailable: "Data unavailable",
		loading: "Loading...",
		candidatesTitle: "Candidates",
		year: "Year",
		termsTitle: "Terms & Conditions",
		terms: [
			"You are currently using this website and viewing the screen alone, without being forced, threatened, or influenced by anyone in casting your vote.",
			"All your personal information is correct.",
			"You have 30 minutes total from login to complete the voting process.",
			"You accept that votes cast through the Faculty of Science, Chulalongkorn University election website are final.",
		],
		acceptButton: "Accept Terms & Conditions",
	},
} as const;

function formatDate(isoString: string, lang: SupportedLanguage) {
	const date = new Date(isoString);
	return date.toLocaleString(lang === "th" ? "th-TH" : "en-GB", {
		dateStyle: "medium",
		timeStyle: "short",
	});
}

export default function AgreementCard({
	candidatesWithImages,
	parties,
	positions,
	eventName,
	votingStartString,
	votingEndString,
}: Props) {
	const [lang, setLang] = useState<SupportedLanguage>("th");
	const [studentId, setStudentId] = useState<string | null>(null);
	const [studentName, setStudentName] = useState<string | null>(null);
	const [error, setError] = useState(false);

	const t = i18n[lang];

	useEffect(() => {
		const headers = authHeader();
		if (!headers) {
			setError(true);
			return;
		}

		api.auth.me
			.get({ headers })
			.then(({ data, error }) => {
				if (error || !data) {
					setError(true);
					return;
				}
				setStudentId(data.studentId);
				setStudentName(data.studentName);
			});
	}, []);

	const displayValue = (value: string | null) => {
		if (error) return t.dataUnavailable;
		return value ?? t.loading;
	};

	const partyMap = Object.fromEntries(parties.map((p) => [p.party_id, p]));
	const positionMap = Object.fromEntries(
		positions.map((p) => [p.position_id, p]),
	);

	return (
		<div className="bg-yellow min-h-screen p-8 flex items-center justify-center font-noto">
			<div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
				{/* Lang switcher */}
				<div className="flex justify-end mb-4">
					<button
						className="text-xs font-semibold border border-dgray rounded-lg px-3 py-1 hover:bg-yellow/30 transition"
						onClick={() => setLang((l) => (l === "th" ? "en" : "th"))}
					>
						{t.langToggle}
					</button>
				</div>

				{/* Event info */}
				<div className="mb-4 text-sm text-dgray space-y-1">
					<p className="font-semibold text-black text-sm leading-snug">
						{lang === "th"
							? eventName
							: "By-election of the Science Student Union Committee, Faculty of Science, Chulalongkorn University 2026"}
					</p>
					<p className="text-xs">
						<span className="font-medium">{t.votingPeriod}: </span>
						{formatDate(votingStartString, lang)} {t.to}{" "}
						{formatDate(votingEndString, lang)}
					</p>
				</div>

				<div className="border-b border-black my-4" />

				{/* Student info */}
				<div className="mb-4 space-y-1 text-base text-dgray">
					<div className="flex justify-between">
						<span>{t.studentId}</span>
						<span>{displayValue(studentId)}</span>
					</div>
					<div className="flex justify-between">
						<span>{t.name}</span>
						<span>{displayValue(studentName)}</span>
					</div>
				</div>

				<div className="border-b border-black my-4" />

				{/* Candidates */}
				<h2 className="text-center font-bold text-black text-base mb-3">
					{t.candidatesTitle}
				</h2>
				<div className="space-y-3 mb-4">
					{candidatesWithImages.map((c) => {
						const position = positionMap[c.position_id];
						const party = partyMap[c.party_id];
						return (
							<div
								key={c.candidate_id}
								className="flex items-center gap-3 rounded-xl border border-gray-200 p-2"
								style={{ borderLeftColor: party?.color, borderLeftWidth: 4 }}
							>
								{c.imageSrc && (
									<img
										src={c.imageSrc}
										alt={c.full_name}
										className="w-12 h-12 rounded-lg object-cover shrink-0"
									/>
								)}
								<div className="text-xs text-dgray min-w-0">
									<p className="font-semibold text-black text-sm truncate">
										{c.full_name}
									</p>
									<p className="truncate">
										{position?.name[lang] ?? position?.name.th}
									</p>
									<p className="truncate text-gray-400">
										{c.study_program[lang] ?? c.study_program.th} · {t.year}{" "}
										{c.study_year}
									</p>
								</div>
							</div>
						);
					})}
				</div>

				<div className="border-b border-black my-4" />

				{/* Terms */}
				<h1 className="text-center font-bold text-black text-xl mb-4">
					{t.termsTitle}
				</h1>
				<ul className="list-disc pl-5 text-sm text-dgray space-y-2">
					{t.terms.map((term, i) => (
						<li key={i}>{term}</li>
					))}
				</ul>

				{/* Accept button */}
				<div className="mt-8 flex justify-center">
					<button
						className="bg-yellow hover:bg-yellow/80 transition text-black text-sm font-semibold py-2 px-4 rounded-xl shadow-md"
						onClick={() => {
							window.location.href = "/election";
						}}
					>
						{t.acceptButton}
					</button>
				</div>
			</div>
		</div>
	);
}
