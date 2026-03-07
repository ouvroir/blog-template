import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	// Charge le fichier markdown
	const modules = import.meta.glob('./+page.md');
	const resolver = modules['./+page.md'];
	const page = (await resolver?.()) as MdsvexFile | undefined;

	// Retourne les métadonnées
	return {
		metadata: {
			title: page?.metadata?.title || '',
			description: page?.metadata?.description || ''
		}
	};
};
