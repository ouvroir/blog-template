<script lang="ts">
	import { tagToSlug } from '$lib/utilities/tags';

	type Props = {
		tags?: string[];
		label?: string;
	};

	let {
		tags = [],
		label = 'Tags de l’article'
	}: Props = $props();
</script>

{#if tags.length > 0}
	<ul aria-label={label}>
		{#each tags as tag (tagToSlug(tag))}
			<li>
				<a href={`/tags/${tagToSlug(tag)}`} aria-label={`Voir les articles du tag ${tag}`}>
					#{tag}
				</a>
			</li>
		{/each}
	</ul>
{/if}

<style>
	ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		list-style: none;
		padding: 0;
		margin: 0.5rem 0 0;
	}
</style>
