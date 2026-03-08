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
export const contactInfo = 'emmanuel.chateau.dutier@umontreal.ca'

// posts shown per page on the main blog index pages
export const postsPerPage = 10;

// ORCID identifier (optional)
export const orcidId = '0000-0003-4092-4569';

// Zotero identifier (optional)
export const zotero = 'emchateau'

// Forge (optional) - version control platform and account identifier
export const forge = {
	service: 'codeberg',
	username: 'emchateau'
}

// Main nav menu (also used by the footer and mobile nav)
// The 'hidden' property is optional: if missing or false, the item is shown by default
export const navItems = [
	{
		title: 'Accueil',
		route: '/',
		hidden: true // Hide this item from the menu
	},
	{
		title: 'Blog',
		route: '/blog'
		// hidden not defined = shown by default
	},
	{
		title: 'Projets',
		route: '/projects'
		// hidden not defined = shown by default
	},
	{
		title: 'Tags',
		route: '/tags'
		// hidden not defined = shown by default
	},
	{
		title: 'À propos',
		route: '/a-propos'
		// hidden not defined = shown by default
	}
];
