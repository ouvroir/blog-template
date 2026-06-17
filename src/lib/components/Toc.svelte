<script lang="ts">
	type Props = { headings?: Heading[]; label?: string; maxDepth?: 2 | 3 };

	let { headings = [], label = 'Table des matières', maxDepth = 2 }: Props = $props();

	const visible = $derived(headings.filter((h) => h.depth <= maxDepth));
</script>

{#if visible.length > 0}
	<nav aria-label={label}>
		<ul>
			{#each visible as h (h.id)}
				<li class:sub={h.depth === 3}>
					<a href="#{h.id}">{h.text}</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
