<script lang="ts">
	import type { PageProps } from './$types';
	import * as config from '$lib/config';

	import PostNavigation from '$lib/components/PostNavigation.svelte';
	import TagList from '$lib/components/TagList.svelte';
	import { normalizeBlogAuthors } from '$lib/utilities/authors';

	let { data }: PageProps = $props();

	const project = $derived(data.project);
	const previousProject = $derived(data.previousProject);
	const nextProject = $derived(data.nextProject);
	const metadata = $derived(project.metadata);
	const Content = $derived(project.component);
	const authors = $derived(normalizeBlogAuthors(metadata.author, config.authorProfiles));
</script>

<svelte:head>
	<title>{metadata.title ? `${metadata.title} | ${config.siteTitle}` : config.siteTitle}</title>
	<meta name="description" content={metadata.description || config.siteDescription} />
</svelte:head>

<Content />

{#if authors.length > 0}
	<p>
		<strong>{authors.length > 1 ? 'Auteurs' : 'Auteur'}:</strong>
		{#each authors as author, index (author.slug || author.id || `${author.name}-${index}`)}
			{#if author.href}
				<a rel="author" href={author.href}>{author.name}</a>
			{:else}
				{author.name}
			{/if}
			{#if index < authors.length - 1}
				<span>, </span>
			{/if}
		{/each}
	</p>
{/if}

{#if metadata.repo || metadata.link}
	<p>
		{#if metadata.repo}
			<a href={metadata.repo} rel="noopener noreferrer" target="_blank">Dépôt du projet</a>
		{/if}
		{#if metadata.repo && metadata.link}
			{' · '}
		{/if}
		{#if metadata.link}
			<a href={metadata.link} rel="noopener noreferrer" target="_blank">Site du projet</a>
		{/if}
	</p>
{/if}

<TagList tags={metadata.tags} />

<PostNavigation previousPost={previousProject} nextPost={nextProject} basePath="/projects/[slug]" />
