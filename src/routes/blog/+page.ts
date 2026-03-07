import type { PageLoad } from './$types';
import { postsPerPage } from '$lib/config';
import { isValidISODate } from '$lib/utilities/isValidISODate';
import { slugFromPath } from '$lib/utilities/slugFromPath';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async () => {
	// Charge tous les posts
	const modules = import.meta.glob(`/src/posts/*.{md,svx,svelte.md}`);
	const postPromises = Object.entries(modules).map(([path, resolver]) =>
		resolver().then(
			(post) =>
				({
					slug: slugFromPath(path),
					...(post as unknown as MdsvexFile).metadata
				} as Posts)
		)
	);

	// Valide et traite les posts
	const posts = await Promise.all(postPromises);
	const invalidDatePosts = posts.filter((post) => !isValidISODate(post.date));

	if (invalidDatePosts.length > 0) {
		const slugs = invalidDatePosts.map((post) => post.slug).join(', ');
		throw error(500, `Invalid frontmatter date format. Expected YYYY-MM-DD for: ${slugs}`);
	}

	const publishedPosts = posts
		.filter((post) => post.published)
		.sort((a, b) => Date.parse(`${b.date}T00:00:00Z`) - Date.parse(`${a.date}T00:00:00Z`))
		.slice(0, postsPerPage);

	// Retourne les posts et métadonnées
	return {
		posts: publishedPosts,
		metadata: {
			title: 'Blog',
			description: ''
		}
	};
};
