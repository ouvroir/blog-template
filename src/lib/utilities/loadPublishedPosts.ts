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

			const candidate = mdsvexPost.metadata as Partial<Posts>;

			if (!isPost(candidate)) {
				throw error(500, `Invalid metadata shape for post: ${pathSlug}`);
			}

			if (!candidate.published) return null;

			const normalizedDate = normalizePostDate(candidate.date);
			if (!normalizedDate) {
				throw error(500, `Invalid metadata date format for: ${candidate.slug ?? pathSlug}`);
			}

			const resolvedSlug = candidate.slug?.trim() || pathSlug;

			return {
				slug: resolvedSlug,
				component: mdsvexPost.default,
				metadata: {
					...candidate,
					slug: resolvedSlug,
					date: normalizedDate,
					tags: normalizeTags(mdsvexPost.metadata.tags)
				}
			};
		})
	);

	return loaded.filter((post): post is LoadedPost => post !== null);
};

const toSortableDate = (date: string): string => (date.length === 7 ? `${date}-01` : date);

export const byPostDateDesc = <T extends { metadata: { date: string } }>(a: T, b: T) =>
	toSortableDate(b.metadata.date).localeCompare(toSortableDate(a.metadata.date));
