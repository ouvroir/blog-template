<script lang="ts">
	import type { PageProps } from './$types';
	import * as config from '$lib/config';
	import ArticleCard from '$lib/components/ArticleCard.svelte';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.tag.name} | {config.siteTitle}</title>
	<meta name="description" content={`Billets associés au tag ${data.tag.name}`} />
</svelte:head>

<h1>Tag: #{data.tag.name}</h1>
<p>{data.tag.count} billet(s)</p>

<section aria-label={`Articles pour le tag ${data.tag.name}`}>
	{#each data.posts as post (post.slug)}
		<ArticleCard
			slug={post.slug}
			title={post.title}
			date={post.date}
			tags={post.tags}
		/>
	{/each}
</section>
