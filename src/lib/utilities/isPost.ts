export const isPost = (value: Partial<Posts>): value is Posts => {
	const hasValidTags =
		typeof value.tags === 'undefined' ||
		typeof value.tags === 'string' ||
		(Array.isArray(value.tags) && value.tags.every((tag) => typeof tag === 'string'));

	return (
		(typeof value.slug === 'undefined' || typeof value.slug === 'string') &&
		typeof value.title === 'string' &&
		typeof value.author === 'string' &&
		typeof value.description === 'string' &&
		(typeof value.date === 'string' || value.date instanceof Date) &&
		typeof value.published === 'boolean' &&
		hasValidTags
	);
};
