<script lang="ts">
	import type { PageProps } from './$types';
	import * as config from '$lib/config';

	let { data }: PageProps = $props();
</script>


<svelte:head>
	<title>Blog | {config.siteTitle}</title>
	<meta name="description" content={config.siteDescription} />
</svelte:head>

<h1>Liste des billets</h1>


{#each data.posts as { slug, title, date }}
	<article>
		<p>Title : {title}</p>
		<p>Date : {date}</p>
		<p><a href="blog/{slug}">{slug}</a></p>
	</article>
{/each}
