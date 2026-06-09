import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

import * as config from '$lib/config';

export const load: PageLoad = async () => {
	const authors = Object.entries(config.authorProfiles)
		.map(([id, profile]) => ({
			id,
			slug: profile.slug,
			name: profile.name || profile.slug,
			href: profile.href || `/auteurs/${profile.slug}`
		}))
		.sort((left, right) => left.name.localeCompare(right.name, 'fr'));

	if (authors.length === 1 && authors[0].href.startsWith('/')) {
		throw redirect(307, authors[0].href);
	}

	return {
		authors,
		metadata: {
			title: 'Auteurs',
			description: 'Index des profils auteurs'
		}
	};
};
