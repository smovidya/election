import { useEffect, useId, useRef, useState } from "react";
import {
	CalendarDays,
	ChevronRight,
	Download,
	ExternalLink,
	X,
} from "lucide-react";
import { event, type LocalizedString } from "@repo/constants";
import { useLocale } from "@/lib/utils";
import { i18n } from "@/lib/i18n";
import { buildCalendarLinks, createCalendarFile } from "@/lib/calendar";

interface Props {
	name: LocalizedString;
	start: string;
	end: string;
}

export default function AddToCalendar({ name, start, end }: Props) {
	const [lang] = useLocale();
	const t = i18n[lang];
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const id = useId();
	const calendarEvent = {
		title: name[lang] ?? name.th ?? "",
		description: event.description[lang] ?? event.description.th,
		start,
		end,
		url: "https://election.vidyachula.org/",
	};
	const links = buildCalendarLinks(calendarEvent);
	const dateFormat = new Intl.DateTimeFormat(
		lang === "th" ? "th-TH" : "en-GB",
		{
			timeZone: "Asia/Bangkok",
			day: "numeric",
			month: "long",
			year: "numeric",
		},
	);
	const timeFormat = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Asia/Bangkok",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23",
	});
	const close = () => dialogRef.current?.close();

	useEffect(() => {
		if (!isOpen) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [isOpen]);

	function downloadCalendar() {
		const blob = new Blob([createCalendarFile(calendarEvent)], {
			type: "text/calendar;charset=utf-8",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "vidya-election.ics";
		document.body.appendChild(link);
		link.click();
		link.remove();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
		close();
	}

	const optionClass =
		"flex w-full items-center gap-3 rounded-xl px-2 py-4 text-left text-black transition-colors hover:bg-yellow/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

	return (
		<>
			<button
				type="button"
				aria-haspopup="dialog"
				aria-controls={id}
				className="mb-1 font-semibold text-black underline decoration-dashed underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
				onClick={() => {
					dialogRef.current?.showModal();
					setIsOpen(true);
				}}
			>
				{t.votingStarts}
			</button>
			<dialog
				ref={dialogRef}
				id={id}
				aria-labelledby={`${id}-title`}
				aria-describedby={`${id}-description`}
				className="fixed inset-x-0 top-auto bottom-0 m-0 max-h-[85dvh] w-full max-w-none overflow-y-auto rounded-t-3xl bg-white p-0 text-black shadow-xl backdrop:bg-black/40 sm:inset-0 sm:m-auto sm:max-w-md sm:rounded-3xl"
				onClose={() => setIsOpen(false)}
				onClick={(e) => {
					if (e.target === e.currentTarget) close();
				}}
			>
				<div className="px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
					<div className="mb-4 flex items-start justify-between gap-4">
						<div>
							<CalendarDays
								className="mb-3 text-dgray"
								size={24}
								aria-hidden="true"
							/>
							<h2 id={`${id}-title`} className="text-lg font-semibold">
								{t.addToCalendar}
							</h2>
						</div>
						<button
							type="button"
							onClick={close}
							aria-label={t.close}
							className="rounded-lg p-2 text-lgray hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring"
						>
							<X size={20} aria-hidden="true" />
						</button>
					</div>
					<p
						id={`${id}-description`}
						className="text-sm leading-relaxed text-lgray"
					>
						{calendarEvent.title}
					</p>
					<div className="mt-3 mb-4 text-sm font-medium">
						<p>
							<time dateTime={start}>
								{dateFormat.format(new Date(start))} ·{" "}
								{timeFormat.format(new Date(start))}
							</time>{" "}
							–{" "}
							<time dateTime={end}>
								{dateFormat.format(new Date(start)) ===
								dateFormat.format(new Date(end))
									? ""
									: `${dateFormat.format(new Date(end))} · `}
								{timeFormat.format(new Date(end))}
							</time>
						</p>
						<p className="mt-1 text-xs font-normal text-lgray">
							{t.bangkokTime}
						</p>
					</div>
					<nav aria-label={t.calendarOptions}>
						<a
							href={links.google}
							target="_blank"
							rel="noopener noreferrer"
							className={optionClass}
							onClick={close}
						>
							<CalendarDays size={20} aria-hidden="true" />
							<span className="flex-1 text-sm font-medium">
								Google Calendar
							</span>
							<ExternalLink size={16} aria-hidden="true" />
							<span className="sr-only">{t.opensNewTab}</span>
						</a>
						<a
							href={links.outlook}
							target="_blank"
							rel="noopener noreferrer"
							className={optionClass}
							onClick={close}
						>
							<CalendarDays size={20} aria-hidden="true" />
							<span className="flex-1 text-sm font-medium">
								Outlook / Microsoft 365
							</span>
							<ExternalLink size={16} aria-hidden="true" />
							<span className="sr-only">{t.opensNewTab}</span>
						</a>
						<button
							type="button"
							className={optionClass}
							onClick={downloadCalendar}
						>
							<Download size={20} aria-hidden="true" />
							<span className="flex-1">
								<span className="block text-sm font-medium">
									Apple Calendar / .ics
								</span>
								<span className="mt-1 block text-xs text-lgray">
									{t.calendarDownload}
								</span>
							</span>
							<ChevronRight size={16} aria-hidden="true" />
						</button>
					</nav>
				</div>
			</dialog>
		</>
	);
}
