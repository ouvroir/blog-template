<script lang="ts">
	import { page } from '$app/state';

	import * as config from '$lib/config';
	import * as seo from '$lib/utilities/seo';
	
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
	
	let { children } = $props();
	let canonical = $derived(seo.getCanonicalUrl(page.url.pathname));
	
	// get metadata from page.data.metadata (+page.ts)
	let metadata = $derived(page.data?.metadata || {});
	let pageTitle = $derived(metadata.title ? `${metadata.title} | ${config.siteTitle}` : config.siteTitle);
	let pageDescription = $derived(metadata.description || config.siteDescription);
</script>

<!-- SEO with page.data.metadata. Pages can override with their own <svelte:head>. -->
<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={canonical} />
</svelte:head>

<a class="skip-link" href="#page-content">Aller au contenu principal</a>

<header>
	<Nav/>
</header>
<main>
	<Breadcrumb/>
	<article id="page-content" tabindex="-1">
		{@render children?.()}
	</article>
</main>
<Footer/>

<style>
	.skip-link {
		position: absolute;
		clip-path: inset(50%);
	}

	.skip-link:focus-visible {
		clip-path: none;
	}
</style>