const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidISODate(date: string): boolean {
	if (!ISO_DATE_RE.test(date)) return false;

	const parsed = new Date(`${date}T00:00:00Z`);
	return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}
