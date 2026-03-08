import type { Component } from 'svelte';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			metadata?: {
				title?: string;
				description?: string;
				author?: string | string[];
				slug?: string;
				[key: string]: unknown;
			};
		}
		// interface PageState {}
		// interface Platform {}
	}

	interface Posts {
		slug?: string;
		title: string;
		author?: string | string[];
		description: string;
		date: string | Date;
		tags?: string[] | string;
		published: boolean;
		[key: string]: unknown;
	}
}

export {};

declare module '*.md' {
	const component: Component;
	export default component;
	export const metadata: Record<string, unknown>;
}

declare module '*.svx' {
	const component: Component;
	export default component;
	export const metadata: Record<string, unknown>;
}
