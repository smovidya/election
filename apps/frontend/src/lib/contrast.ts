/** Choose an opaque black/white foreground using WCAG's sRGB luminance formula. */
export function getAccessibleColors(color?: string) {
	let hex = color?.trim() ?? "#6b7280";
	if (/^#[\da-f]{3}$/i.test(hex)) {
		hex = `#${hex
			.slice(1)
			.split("")
			.map((digit) => digit + digit)
			.join("")}`;
	}
	// Candidate colors are opaque hex values; use gray for invalid configuration.
	if (!/^#[\da-f]{6}$/i.test(hex)) hex = "#6b7280";
	const channels = [1, 3, 5].map((offset) => {
		const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
		return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
	});
	const luminance =
		0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
	const blackContrast = (luminance + 0.05) / 0.05;
	const whiteContrast = 1.05 / (luminance + 0.05);
	return {
		backgroundColor: hex,
		textClass: blackContrast >= whiteContrast ? "text-black" : "text-white",
	};
}
