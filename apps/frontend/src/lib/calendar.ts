export interface CalendarEvent {
	title: string;
	description: string;
	start: string;
	end: string;
	url: string;
}

const calendarDate = (date: string | Date) =>
	new Date(date)
		.toISOString()
		.replace(/[-:]/g, "")
		.replace(/\.\d{3}/, "");

export function buildCalendarLinks(event: CalendarEvent) {
	const details = `${event.description}\n\n${event.url}`;
	const google = new URL("https://calendar.google.com/calendar/render");
	google.search = new URLSearchParams({
		action: "TEMPLATE",
		text: event.title,
		dates: `${calendarDate(event.start)}/${calendarDate(event.end)}`,
		ctz: "Asia/Bangkok",
		details,
		location: event.url,
	}).toString();
	const outlook = new URL(
		"https://outlook.office.com/calendar/0/deeplink/compose",
	);
	outlook.search = new URLSearchParams({
		path: "/calendar/action/compose",
		rru: "addevent",
		subject: event.title,
		startdt: new Date(event.start).toISOString(),
		enddt: new Date(event.end).toISOString(),
		body: details,
		location: event.url,
		allday: "false",
	}).toString();
	return { google: google.href, outlook: outlook.href };
}

const escapeText = (text: string) =>
	text
		.replace(/\\/g, "\\\\")
		.replace(/\r\n|\r|\n/g, "\\n")
		.replace(/;/g, "\\;")
		.replace(/,/g, "\\,");

/** RFC 5545 limits each physical line to 75 UTF-8 octets. */
function foldLine(line: string) {
	const encoder = new TextEncoder();
	let result = "";
	let bytes = 0;
	for (const character of line) {
		const size = encoder.encode(character).length;
		if (bytes + size > 75) {
			result += "\r\n ";
			bytes = 1;
		}
		result += character;
		bytes += size;
	}
	return result;
}

export function createCalendarFile(event: CalendarEvent, now = new Date()) {
	return (
		[
			"BEGIN:VCALENDAR",
			"VERSION:2.0",
			"PRODID:-//Vidya Chula//Election//EN",
			"CALSCALE:GREGORIAN",
			"BEGIN:VEVENT",
			`UID:${calendarDate(event.start)}-election@${new URL(event.url).hostname}`,
			`DTSTAMP:${calendarDate(now)}`,
			`DTSTART:${calendarDate(event.start)}`,
			`DTEND:${calendarDate(event.end)}`,
			`SUMMARY:${escapeText(event.title)}`,
			`DESCRIPTION:${escapeText(`${event.description}\n\n${event.url}`)}`,
			`LOCATION:${escapeText(event.url)}`,
			`URL:${event.url}`,
			"END:VEVENT",
			"END:VCALENDAR",
		]
			.map(foldLine)
			.join("\r\n") + "\r\n"
	);
}
