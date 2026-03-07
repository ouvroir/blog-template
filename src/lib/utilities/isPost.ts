export const isPost = (value: Partial<Posts>): value is Posts => {
	return (
		typeof value.slug === 'string' &&
		typeof value.title === 'string' &&
		typeof value.author === 'string' &&
		typeof value.description === 'string' &&
		(typeof value.date === 'string' || value.date instanceof Date) &&
		typeof value.published === 'boolean'
	);
};
