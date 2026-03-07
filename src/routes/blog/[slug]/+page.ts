import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import { isPost } from '$lib/utilities/isPost';
import { normalizePostDate } from '$lib/utilities/normalizePostDate';
import { slugFromPath } from '$lib/utilities/slugFromPath';

export const load: PageLoad = async ({ params }) => {
	// Load post
	const modules = import.meta.glob(`/src/posts/*.{md,svx,svelte.md}`);
	const match = Object.entries(modules).find(([path]) => slugFromPath(path) === params.slug);

	if (!match) {
		throw error(404); // Couldn't resolve the post
	}

	const [, resolver] = match;
	const post = await resolver();
	const mdsvexPost = post as {
		default: import('svelte').ComponentType;
		metadata: Record<string, unknown>;
	};

	const postMetadata: Partial<Posts> = {
		slug: params.slug,
		...mdsvexPost.metadata
	};

	if (!isPost(postMetadata)) {
		throw error(500, `Invalid metadata shape for post: ${params.slug}`);
	}

	const normalizedDate = normalizePostDate(postMetadata.date);

	if (!normalizedDate) {
		throw error(500, `Invalid metadata date for post: ${params.slug}`);
	}

	if (!postMetadata.published) {
		throw error(404); // Couldn't resolve the post
	}

	const normalizedMetadata: Posts = {
		...postMetadata,
		date: normalizedDate
	};

	const postData = {
		component: mdsvexPost.default,
		metadata: normalizedMetadata
	};

	return {
		post: postData,
		metadata: {
			title: postData.metadata.title,
			description: postData.metadata.description
		}
	};
};