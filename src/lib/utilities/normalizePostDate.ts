import { isValidISODate } from '$lib/utilities/isValidISODate';

export const normalizePostDate = (date: string | Date): string | null => {
	if (date instanceof Date) {
		if (Number.isNaN(date.getTime())) return null;
		// For dates parsed by YAML, extract local date to avoid timezone offset issues
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	if (typeof date === 'string') {
		// Handle ISO 8601 format with time (e.g., "2023-01-05T00:00:00.000Z")
		if (date.includes('T')) {
			try {
				const parsed = new Date(date);
				if (!Number.isNaN(parsed.getTime())) {
					return date.slice(0, 10); // Extract YYYY-MM-DD
				}
			} catch {
				return null;
			}
		}

		// Handle simple date formats
		if (isValidISODate(date)) {
			// Normalize YYYY-MM to YYYY-MM-01 for sorting
			if (date.length === 7) {
				return `${date}-01`;
			}
			// YYYY-MM-DD passes through unchanged
			return date;
		}

		return null;
	}

	return null;
};
