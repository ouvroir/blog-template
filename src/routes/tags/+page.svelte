<script lang="ts">
	import type { PageProps } from './$types';
	import * as config from '$lib/config';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Tags | {config.siteTitle}</title>
	<meta name="description" content="Index des tags de tous les billets" />
</svelte:head>

<h1>Tags</h1>

{#if data.tags.length === 0}
	<p>Aucun tag pour le moment.</p>
{:else}
	<ul>
		{#each data.tags as tag (tag.slug)}
			<li>
				<a href={`/tags/${tag.slug}`}>#{tag.tag}</a> ({tag.count})
			</li>
		{/each}
	</ul>
{/if}
