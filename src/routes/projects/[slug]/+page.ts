import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import { loadProjects } from '$lib/utilities/loadProjects';
import type { LoadedProjects } from '$lib/utilities/loadProjects';

const toNavigationProject = (project: LoadedProjects) => ({
	slug: project.slug,
	title: project.metadata.title,
	date: project.metadata.date
});

export const load: PageLoad = async ({ params }) => {
	const allProjects = await loadProjects();
	const currentIndex = allProjects.findIndex((project) => project.slug === params.slug);
	if (currentIndex === -1) {
		throw error(404);
	}
	const currentProject = allProjects[currentIndex];

	const previousProject =
		currentIndex < allProjects.length - 1
			? toNavigationProject(allProjects[currentIndex + 1])
			: null;
	const nextProject =
		currentIndex > 0 ? toNavigationProject(allProjects[currentIndex - 1]) : null;

	return {
		project: currentProject,
		previousProject,
		nextProject,
		metadata: {
			title: currentProject.metadata.title,
			description: currentProject.metadata.description
		}
	};
};
