import type { Component } from 'svelte';
import { error } from '@sveltejs/kit';

import { isPost } from '$lib/utilities/isPost';
import { normalizePostDate } from '$lib/utilities/normalizePostDate';
import { slugFromPath } from '$lib/utilities/slugFromPath';
import { normalizeTags } from '$lib/utilities/tags';

export type LoadedPost = {
	slug: string;
	component: Component;
	metadata: Posts & {
		date: string;
		tags: string[];
	};
};

export const loadPublishedPosts = async (): Promise<LoadedPost[]> => {
	const modules = import.meta.glob('/src/posts/*.{md,svx,svelte.md}');
	const entries = Object.entries(modules);

	const loaded = await Promise.all(
		entries.map(async ([path, resolver]): Promise<LoadedPost | null> => {
			const pathSlug = slugFromPath(path);
			if (!pathSlug) {
				throw error(500, `Invalid post path: ${path}`);
			}

			const module = await resolver();
			const mdsvexPost = module as {
				default: Component;
				metadata: Record<string, unknown>;
			};

			const frontmatter = mdsvexPost.metadata as Partial<Posts>;

			if (!isPost(frontmatter)) {
				throw error(500, `Invalid metadata shape for post: ${pathSlug}`);
			}

			if (!frontmatter.published) return null;

			const normalizedDate = normalizePostDate(frontmatter.date);
			if (!normalizedDate) {
				throw error(500, `Invalid metadata date format for: ${frontmatter.slug ?? pathSlug}`);
			}

			const resolvedSlug = frontmatter.slug?.trim() || pathSlug;

			return {
				slug: resolvedSlug,
				component: mdsvexPost.default,
				metadata: {
					...frontmatter,
					slug: resolvedSlug,
					date: normalizedDate,
					tags: normalizeTags(mdsvexPost.metadata.tags)
				}
			};
		})
	);

	const publishedPosts = loaded.filter((post): post is LoadedPost => post !== null);
	const seenSlugs = new Set<string>();

	for (const post of publishedPosts) {
		if (seenSlugs.has(post.slug)) {
			throw error(500, `Duplicate post slug detected: ${post.slug}`);
		}

		seenSlugs.add(post.slug);
	}

	return publishedPosts;
};

const toSortableDate = (date: string): string => (date.length === 7 ? `${date}-01` : date);

export const byPostDateDesc = <T extends { metadata: { date: string } }>(a: T, b: T) =>
	toSortableDate(b.metadata.date).localeCompare(toSortableDate(a.metadata.date));
