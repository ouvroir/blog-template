<script lang="ts">
	import type { PageProps } from './$types';
	import * as config from '$lib/config';
	import ArticleCard from '$lib/components/ArticleCard.svelte';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.tag.tag} | {config.siteTitle}</title>
	<meta name="description" content={`Billets associés au tag ${data.tag.tag}`} />
</svelte:head>

<h1>Tag: #{data.tag.tag}</h1>
<p>{data.tag.count} billet(s)</p>

<section aria-label={`Articles pour le tag ${data.tag.tag}`}>
	{#each data.posts as item (item.slug)}
		<ArticleCard slug={item.slug} title={item.title} date={item.date} tags={item.tags} />
	{/each}
</section>
