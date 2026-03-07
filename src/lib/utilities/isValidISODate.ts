const ISO_DATE_RE = /^\d{4}-\d{2}(-\d{2})?$/; // Matches YYYY-MM or YYYY-MM-DD

export function isValidISODate(date: string): boolean {
	if (!ISO_DATE_RE.test(date)) return false;

	// Handle YYYY-MM-DD format
	if (date.length === 10) {
		const parsed = new Date(`${date}T00:00:00Z`);
		return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
	}

	// Handle YYYY-MM format (validate month is 01-12)
	if (date.length === 7) {
		const month = parseInt(date.slice(5, 7), 10);
		return month >= 1 && month <= 12;
	}

	return false;
}
