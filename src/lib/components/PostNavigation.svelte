<script lang="ts">
	type NavigationPost = {
		slug: string;
		title: string;
	};

	interface Props {
		previousPost?: NavigationPost | null;
		nextPost?: NavigationPost | null;
	}

	let {
		previousPost = null,
		nextPost = null
	}: Props = $props();
</script>

{#if previousPost || nextPost}
	<nav aria-label="Navigation entre articles">
		{#if previousPost}
			<a
				href={`/blog/${previousPost.slug}`}
				rel="prev"
				aria-label={`Article precedent: ${previousPost.title}`}
			>
				← {previousPost.title}
			</a>
		{/if}
		{#if nextPost}
			<a
				href={`/blog/${nextPost.slug}`}
				rel="next"
				aria-label={`Article suivant: ${nextPost.title}`}
			>
				{nextPost.title} →
			</a>
		{/if}
	</nav>
{/if}

<style>
	nav {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 3rem;
	}

	nav a {
		flex: 1;
		padding: 1rem;
		border: 1px solid var(--color-bg-secondary);
		border-radius: var(--border-radius);
	}

	nav a[rel="next"] {
		text-align: right;
	}

	@media (max-width: 768px) {
		nav {
			flex-direction: column;
		}
	}
</style>
