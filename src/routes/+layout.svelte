<script lang="ts">
	import { page } from '$app/stores';
	let { children } = $props();
	import Nav from '$lib/components/Nav.svelte';
	import * as config from '$lib/config';
	import * as seo from '$lib/utilities/seo';
	
	let canonical = $derived(seo.getCanonicalUrl($page.url.pathname));
	
	// Récupère les métadonnées depuis $page.data.metadata (défini par les +page.ts)
	let metadata = $derived($page.data?.metadata || {});
	let pageTitle = $derived(metadata.title ? `${metadata.title} | ${config.siteTitle}` : config.siteTitle);
	let pageDescription = $derived(metadata.description || config.siteDescription);
</script>

<!-- SEO par défaut depuis $page.data.metadata. Les pages peuvent surcharger avec leur propre <svelte:head>. -->
<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={canonical} />
</svelte:head>

<Nav/>
<main>
	{@render children?.()}
</main>
<footer>
	<p>footer</p>
</footer>