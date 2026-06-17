import type { PageServerLoad } from './$types';

import { loadPublishedPosts } from '$lib/utilities/loadPublishedPosts';
import { loadProjects } from '$lib/utilities/loadProjects';
import { loadZoteroTaggedPublications } from '$lib/utilities/loadZoteroPublications';
import { getTagSummaries, type TagSummary } from '$lib/utilities/tags';

const mergeTagSummaries = (...groups: TagSummary[][]): TagSummary[] => {
	const bySlug = new Map<string, TagSummary>();

	for (const group of groups) {
		for (const summary of group) {
			const current = bySlug.get(summary.slug);
			if (current) {
				current.count += summary.count;
			} else {
				bySlug.set(summary.slug, { ...summary });
			}
		}
	}

	return Array.from(bySlug.values()).sort((a, b) => a.tag.localeCompare(b.tag, 'fr'));
};

export const load: PageServerLoad = async ({ fetch }) => {
	const [posts, projects] = await Promise.all([loadPublishedPosts(), loadProjects()]);
	const postTags = mergeTagSummaries(getTagSummaries(posts));
	const projectTags = mergeTagSummaries(getTagSummaries(projects));

	let publicationTags: ReturnType<typeof getTagSummaries> = [];
	try {
		const publications = await loadZoteroTaggedPublications(fetch);
		publicationTags = getTagSummaries(
			publications.map((publication) => ({ metadata: { tags: publication.tags } }))
		);
	} catch (caught) {
		console.warn('Unable to load Zotero publication tags:', caught);
		publicationTags = [];
	}

	return {
		postTags,
		projectTags,
		publicationTags,
		metadata: {
			title: 'Tags',
			description: 'Index des tags des billets, des projets et des publications'
		}
	};
};
