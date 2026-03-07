import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import * as config from '$lib/config';

import { isPost } from '$lib/utilities/isPost';
import { normalizePostDate } from '$lib/utilities/normalizePostDate';
import { slugFromPath } from '$lib/utilities/slugFromPath';

export const load: PageLoad = async () => {
	// Load all posts
	const modules = import.meta.glob(`/src/posts/*.{md,svx,svelte.md}`);
	const postPromises = Object.entries(modules).map(([path, resolver]) =>
		resolver().then((post) => {
			const slug = slugFromPath(path);

			if (!slug) {
				throw error(500, `Invalid post path: ${path}`);
			}

			const candidate: Partial<Posts> = {
				slug,
				...(post as { metadata: Record<string, unknown> }).metadata
			};

			if (!isPost(candidate)) {
				throw error(500, `Invalid metadata shape for post: ${slugFromPath(path)}`);
			}

			return candidate;
		})
	);

	// Validate and process posts
	const posts = await Promise.all(postPromises);
	const normalizedPosts = posts.map((post) => {
		const normalizedDate = normalizePostDate(post.date);

		if (!normalizedDate) {
			throw error(500, `Invalid metadata date format for: ${post.slug}`);
		}

		return {
			...post,
			date: normalizedDate
		};
	});

	const publishedPosts = normalizedPosts
		.filter((post) => post.published)
		.sort(
			(a, b) => Date.parse(`${b.date}T00:00:00Z`) - Date.parse(`${a.date}T00:00:00Z`)
		)
		.slice(0, config.postsPerPage);

	// Return post and metadata
	return {
		posts: publishedPosts,
		metadata: {
			title: 'Blog',
			description: 'Liste des posts'
		}
	};
};
