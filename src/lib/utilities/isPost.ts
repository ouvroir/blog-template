const isStringArray = (value: unknown): value is string[] =>
	Array.isArray(value) && value.every((item) => typeof item === 'string');

export const isPost = (value: Partial<Posts>): value is Posts => {
	const hasValidAuthor =
		typeof value.author === 'undefined' ||
		typeof value.author === 'string' ||
		isStringArray(value.author);

	const hasValidTags =
		typeof value.tags === 'undefined' ||
		typeof value.tags === 'string' ||
		isStringArray(value.tags);

	return (
		(typeof value.slug === 'undefined' || typeof value.slug === 'string') &&
		typeof value.title === 'string' &&
		hasValidAuthor &&
		typeof value.description === 'string' &&
		(typeof value.date === 'string' || value.date instanceof Date) &&
		typeof value.published === 'boolean' &&
		hasValidTags
	);
};
