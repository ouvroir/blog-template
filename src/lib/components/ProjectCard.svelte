<script lang="ts">
	import { resolve } from '$app/paths';
	import { authorProfiles } from '$lib/config';
	import TagList from '$lib/components/TagList.svelte';
	import { normalizeBlogAuthors } from '$lib/utilities/authors';

	type Props = {
		slug: string;
		title: string;
		date: string;
		authors?: BlogAuthorInput | BlogAuthorInput[];
		repo?:string;
		link?: string;
		tags?: string[];
	};

	const { slug, title, date, authors, repo, link, tags }: Props = $props();

	const normalizedAuthors = $derived(normalizeBlogAuthors(authors, authorProfiles));
	const authorLabel = $derived(normalizedAuthors.length > 1 ? 'Auteurs' : 'Auteur');
	const url = $derived(resolve('/projects/[slug]', { slug }));
</script>

<article class="postCard">
	<header>
		<h2>{title}</h2>
		<dl>
			{#if normalizedAuthors.length > 0}
				<dt>{authorLabel}</dt>
				<dd>
					{#each normalizedAuthors as author, authorIndex (author.slug || author.id || `${author.name}-${authorIndex}`)}
						{authorIndex > 0 ? ', ' : ''}
						{#if author.href}
							<a rel="author" href={author.href}>{author.name}</a>
						{:else}
							{author.name}
						{/if}
					{/each}
				</dd>
			{/if}
			<dt>Date</dt>
			<dd><time datetime={date}>{date}</time></dd>
			{#if repo}
				<dt>Dépôt</dt>
				<dd><a href={repo} rel="noopener noreferrer" target="_blank">{repo}</a></dd>
			{/if}
			{#if link}
				<dt>Site</dt>
				<dd><a href={link} rel="noopener noreferrer" target="_blank">{link}</a></dd>
			{/if}
			{#if (tags?.length ?? 0) > 0}
				<dt>Tags</dt>
				<dd>
					<TagList tags={tags ?? []} label="Tags du projet" />
				</dd>
			{/if}
		</dl>
	</header>
	<p>
		<a
			class="stretchedLink"
			rel="bookmark"
			href={url}
			aria-label={`Lire la suite&nbsp;: ${title}`}
		>
			Lire la suite&nbsp;→
		</a>
	</p>
</article>

<style>
	.postCard {
		position: relative;
	}

	h2 {
		margin-top: 0;
	}

	dl {
		margin: 0;
	}

	dt,
	dd {
		display: inline;
		margin: 0;
	}

	dt:not(:first-of-type)::before {
		content: ' ';
	}

	dt::after {
		content: ' ';
	}

	dd:not(:last-of-type)::after {
		content: ' · ';
	}

	.stretchedLink::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
	}

	.postCard a:not(.stretchedLink) {
		position: relative;
		z-index: 2;
	}

	.postCard:focus-within {
		outline: 2px solid currentColor;
		outline-offset: 3px;
	}
</style>
