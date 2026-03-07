/**
 * Values used across the site.
 *
 * This file should be updated with your own values.
 **/

export const siteTitle = 'Blog template';
export const siteDescription = 'Built with the SvelteKit Ouvroir’s Static Blog Starter';
export const siteURL = 'example.com';
export const siteLink = 'https://github.com/ouvroir/blog-template';
export const siteAuthor = 'Ouvroir';

// posts shown per page on the main blog index pages
export const postsPerPage = 10;

// Main nav menu (also used by the footer and mobile nav)
export const navItems = [
	{
		title: 'Accueil',
		route: '/'
	},
	{
		title: 'Blog',
		route: '/blog'
	},
	{
		title: 'À propos',
		route: '/a-propos'
	}
];
