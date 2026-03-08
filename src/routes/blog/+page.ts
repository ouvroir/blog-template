import type { PageLoad } from './$types';

import * as config from '$lib/config';

import { byPostDateDesc, loadPublishedPosts } from '$lib/utilities/loadPublishedPosts';
import { getTagSummaries } from '$lib/utilities/tags';

export const load: PageLoad = async () => {
	const posts = (await loadPublishedPosts()).sort(byPostDateDesc);
	const publishedPosts = posts.slice(0, config.postsPerPage).map((post) => ({
		slug: post.slug,
		title: post.metadata.title,
		date: post.metadata.date,
		tags: post.metadata.tags
	}));
	const tags = getTagSummaries(posts);

	return {
		posts: publishedPosts,
		tags,
		metadata: {
			title: 'Blog',
			description: 'Liste des posts'
		}
	};
};
