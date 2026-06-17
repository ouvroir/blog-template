import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import { loadPublishedPosts } from '$lib/utilities/loadPublishedPosts';
import { loadProjects } from '$lib/utilities/loadProjects';
import { loadZoteroTaggedPublications } from '$lib/utilities/loadZoteroPublications';
import { getTagSummaries, tagToSlug, type TagSummary } from '$lib/utilities/tags';

const hasTag = (tags: string[], selectedTag: string): boolean =>
	tags.some((value) => tagToSlug(value) === selectedTag);

const listByTag = <TItem>(
	items: TItem[],
	getTags: (item: TItem) => string[],
	selectedTag: string
): TItem[] => items.filter((item) => hasTag(getTags(item), selectedTag));

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

export const load: PageServerLoad = async ({ params, fetch }) => {
	const [allPosts, allProjects] = await Promise.all([loadPublishedPosts(), loadProjects()]);

	const contentTagSummaries = mergeTagSummaries(
		getTagSummaries(allPosts),
		getTagSummaries(allProjects)
	);

	let publicationItems: Awaited<ReturnType<typeof loadZoteroTaggedPublications>> = [];
	let publicationTagSummaries: ReturnType<typeof getTagSummaries> = [];
	let publicationsUnavailable = false;

	try {
		const allPublications = await loadZoteroTaggedPublications(fetch);
		publicationItems = allPublications.filter((publication) =>
			publication.tags.some((tag) => tagToSlug(tag) === params.tag)
		);
		publicationTagSummaries = getTagSummaries(
			allPublications.map((publication) => ({ metadata: { tags: publication.tags } }))
		);
	} catch (caught) {
		console.warn('Unable to load Zotero publications for tag page:', caught);
		publicationItems = [];
		publicationTagSummaries = [];
		publicationsUnavailable = true;
	}

	const currentContentTag = contentTagSummaries.find((tag) => tag.slug === params.tag);
	const currentPublicationTag = publicationTagSummaries.find((tag) => tag.slug === params.tag);

	if (!currentContentTag && !currentPublicationTag && !publicationsUnavailable) {
		throw error(404, 'Tag introuvable');
	}

	const postTagSummaries = getTagSummaries(allPosts);
	const projectTagSummaries = getTagSummaries(allProjects);

	const tag = {
		name: currentContentTag?.tag || currentPublicationTag?.tag || params.tag,
		slug: params.tag,
		postCount: postTagSummaries.find((t) => t.slug === params.tag)?.count ?? 0,
		projectCount: projectTagSummaries.find((t) => t.slug === params.tag)?.count ?? 0,
		publicationCount: currentPublicationTag?.count ?? 0
	};

	const posts = listByTag(allPosts, (post) => post.metadata.tags, params.tag).map((post) => ({
		slug: post.slug,
		title: post.metadata.title,
		date: post.metadata.date,
		readingTime: post.metadata.readingTime,
		tags: post.metadata.tags
	}));

	const projects = listByTag(allProjects, (project) => project.metadata.tags, params.tag).map(
		(project) => ({
			slug: project.slug,
			title: project.metadata.title,
			date: project.metadata.date,
			author: project.metadata.author,
			repo: project.metadata.repo,
			link: project.metadata.link,
			tags: project.metadata.tags
		})
	);

	const publications = publicationItems.map(
		(publication, index) =>
			({
				key: publication.zoteroUrl || `${params.tag}-${index}`,
				title: publication.title,
				formattedCitation: publication.formattedCitation,
				itemType: 'document',
				date: publication.date,
				parsedDate: publication.parsedDate,
				creators: [],
				tags: publication.tags,
				detailFields: [],
				zoteroUrl: publication.zoteroUrl
			}) satisfies ZoteroPublication
	);

	return {
		tag,
		posts,
		projects,
		publications,
		metadata: {
			title: `Tag: ${tag.name}`,
			description: `Ressources associées au tag ${tag.name}`
		}
	};
};
