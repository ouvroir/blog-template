import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import { byPostDateDesc, loadPublishedPosts } from '$lib/utilities/loadPublishedPosts';

const toNavigationPost = (post: Awaited<ReturnType<typeof loadPublishedPosts>>[number]) => ({
	slug: post.slug,
	title: post.metadata.title,
	date: post.metadata.date
});

export const load: PageLoad = async ({ params }) => {
	const allPosts = (await loadPublishedPosts()).sort(byPostDateDesc);

	const currentPost = allPosts.find((post) => post.slug === params.slug);
	if (!currentPost) {
		throw error(404); // Couldn't resolve the post
	}

	const currentIndex = allPosts.findIndex((post) => post.slug === params.slug);
	const previousPost = currentIndex < allPosts.length - 1 ? toNavigationPost(allPosts[currentIndex + 1]) : null;
	const nextPost = currentIndex > 0 ? toNavigationPost(allPosts[currentIndex - 1]) : null;

	return {
		post: currentPost,
		previousPost,
		nextPost,
		metadata: {
			title: currentPost.metadata.title,
			description: currentPost.metadata.description
		}
	};
};