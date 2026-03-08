import type { PageLoad } from './$types';

import { loadPublishedPosts } from '$lib/utilities/loadPublishedPosts';
import { getTagSummaries } from '$lib/utilities/tags';

export const load: PageLoad = async () => {
	const posts = await loadPublishedPosts();
	const tags = getTagSummaries(posts);

	return {
		tags,
		metadata: {
			title: 'Tags',
			description: 'Index des tags de tous les billets'
		}
	};
};
