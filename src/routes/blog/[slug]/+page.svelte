<script lang="ts">
	import type { PageProps } from './$types';
	import * as config from '$lib/config';

	let { data }: PageProps = $props();
	const { post } = data;
	const { component: Component, metadata } = post;
</script>

<svelte:head>
	<title>{metadata.title ? `${metadata.title} | ${config.siteTitle}` : config.siteTitle}</title>
	<meta name="description" content={metadata.description || config.siteDescription} />
</svelte:head>

<Component />
