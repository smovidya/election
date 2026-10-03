const mockTimeKey = "election_dev_time";

/** Election time only: authentication and token expiry keep using real time. */
export function mockTime(): string | null {
	if (!import.meta.env.DEV || typeof window === "undefined") return null;
	const value = sessionStorage.getItem(mockTimeKey);
	if (!value || Number.isNaN(Date.parse(value))) return null;
	return new Date(value).toISOString();
}

export function electionNow(): number {
	const value = mockTime();
	return value ? Date.parse(value) : Date.now();
}

export function setMockTime(value: string | null) {
	if (!import.meta.env.DEV) return;
	if (value === null) sessionStorage.removeItem(mockTimeKey);
	else {
		const date = new Date(value);
		if (Number.isNaN(date.valueOf()))
			throw new Error("Enter a valid date and time.");
		sessionStorage.setItem(mockTimeKey, date.toISOString());
	}
}
