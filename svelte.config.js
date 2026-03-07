import { mdsvex } from 'mdsvex';
// import rehypeAutolinkHeadings from "rehype-autolink-headings";
// import rehypeSlug from "rehype-slug";
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex(
	  {// The default mdsvex extension is .svx; this overrides that.
			extensions: [".md", ".svx"],

			// Adds IDs to headings, and anchor links to those IDs. Note: must stay in this order to work.
			// rehypePlugins: [
			//	rehypeSlug,
			//	rehypeAutolinkHeadings,
			//],}
		}
	)],
  kit: {
    adapter: adapter(),
    prerender: {
      entries: [
        "*",
        "/api/posts/page/*",
        "/blog/category/*/page/",
        "/blog/category/*/page/*",
        "/blog/category/page/",
        "/blog/category/page/*",
        "/blog/page/",
        "/blog/page/*",
      ],
    },
  },
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
