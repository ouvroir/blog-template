import type { PageLoad } from './$types';

import * as config from '$lib/config';

import { loadProjects } from '$lib/utilities/loadProjects';
import { getTagSummaries } from '$lib/utilities/tags';

export const load: PageLoad = async () => {
	const allProjects = await loadProjects();
	const projects = allProjects.slice(0, config.projectsPerPage).map((project) => ({
		slug: project.slug,
		title: project.metadata.title,
		date: project.metadata.date,
		author: project.metadata.author,
		repo: project.metadata.repo,
		link: project.metadata.link,
		tags: project.metadata.tags
	}));
	const tags = getTagSummaries(allProjects);

	return {
		projects,
		tags,
		metadata: {
			title: 'Projets',
			description: 'Liste des projets'
		}
	};
};
