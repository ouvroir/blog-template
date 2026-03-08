import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import { byPostDateDesc, loadPublishedPosts } from '$lib/utilities/loadPublishedPosts';
import { getTagSummaries, tagToSlug } from '$lib/utilities/tags';

export const load: PageLoad = async ({ params }) => {
	const allPosts = (await loadPublishedPosts()).sort(byPostDateDesc);
	const tags = getTagSummaries(allPosts);
	const currentTag = tags.find((tag) => tag.slug === params.tag);

	if (!currentTag) {
		throw error(404, 'Tag introuvable');
	}

	const tag = {
		name: currentTag.tag,
		slug: currentTag.slug,
		count: currentTag.count
	};

	const posts = allPosts
		.filter((post) => post.metadata.tags.some((tag) => tagToSlug(tag) === params.tag))
		.map((post) => ({
			slug: post.slug,
			title: post.metadata.title,
			date: post.metadata.date,
			tags: post.metadata.tags
		}));

	return {
		tag,
		posts,
		metadata: {
			title: `Tag: ${tag.name}`,
			description: `Billets associés au tag ${tag.name}`
		}
	};
};
