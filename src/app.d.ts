// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	interface MdsvexFile {
		default: import('svelte/internal').SvelteComponent;
		metadata: Record<string, string>;
	}

	type MdsvexResolver = () => Promise<MdsvexFile>;

	interface Posts {
		slug: string;
		title: string;
		author: string;
		description: string;
		date: string;
		published: boolean;
	}
}

export {};

declare module '*.md' {
	const component: import('svelte').ComponentType;
	export default component;
	export const metadata: Record<string, unknown>;
}

declare module '*.svx' {
	const component: import('svelte').ComponentType;
	export default component;
	export const metadata: Record<string, unknown>;
}
