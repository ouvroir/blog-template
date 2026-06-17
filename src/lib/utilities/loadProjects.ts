import type { Component } from 'svelte';
import { error } from '@sveltejs/kit';

import { isProject } from '$lib/utilities/isProject';
import { normalizePostDate } from '$lib/utilities/dates';
import { slugFromPath } from '$lib/utilities/slugFromPath';
import { normalizeTags } from '$lib/utilities/tags';

export type LoadedProjects = {
	slug: string;
	component: Component;
	metadata: Projects & {
		date: string;
		repo?: string;
		link?: string;
		tags: string[];
	};
};

// Public API
export const loadProjects = async (): Promise<LoadedProjects[]> => {
	const modules = import.meta.glob('/src/projects/*.{md,svx,svelte.md}');
	const entries = Object.entries(modules);

	const loaded = await Promise.all(
		entries.map(async ([path, resolver]): Promise<LoadedProjects | null> => {
			const pathSlug = slugFromPath(path);
			if (!pathSlug) {
				throw error(500, `Invalid project path: ${path}`);
			}

			const module = await resolver();
			const mdsvexPost = module as {
				default: Component;
				metadata: Record<string, unknown>;
			};

			const frontmatter = mdsvexPost.metadata as Partial<Projects>;

			if (!isProject(frontmatter)) {
				throw error(500, `Invalid metadata shape for post: ${pathSlug}`);
			}

			if (!frontmatter.published) return null;

			const normalizedDate = normalizePostDate(frontmatter.date ?? '');
			if (!normalizedDate) {
				throw error(500, `Invalid metadata date format for: ${frontmatter.slug ?? pathSlug}`);
			}

			const resolvedSlug = frontmatter.slug?.trim() || pathSlug;

			let repoUrl: string | undefined;
			let linkUrl: string | undefined;
			try {
				repoUrl = frontmatter.repo ? new URL(String(frontmatter.repo)).href : undefined;
				linkUrl = frontmatter.link ? new URL(String(frontmatter.link)).href : undefined;
			} catch {
				throw error(500, `Invalid URL in project metadata: ${resolvedSlug}`);
			}

			return {
				slug: resolvedSlug,
				component: mdsvexPost.default,
				metadata: {
					...frontmatter,
					slug: resolvedSlug,
					date: normalizedDate,
					repo: repoUrl,
					link: linkUrl,
					tags: normalizeTags(mdsvexPost.metadata.tags)
				} as LoadedProjects['metadata']
			};
		})
	);

	const publishedProjects = loaded.filter((project): project is LoadedProjects => project !== null);
	const seenSlugs = new Set<string>();

	for (const project of publishedProjects) {
		if (seenSlugs.has(project.slug)) {
			throw error(500, `Duplicate post slug detected: ${project.slug}`);
		}

		seenSlugs.add(project.slug);
	}

	return publishedProjects.toSorted(byPostDateDesc);
};

const byPostDateDesc = <T extends { metadata: { date: string } }>(a: T, b: T) =>
	b.metadata.date.localeCompare(a.metadata.date);
