<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';
	import * as config from '$lib/config';
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	let { data }: PageProps = $props();
	const url = (tag: string) => resolve('/tags/[tag]', { tag });
</script>

<svelte:head>
	<title>Projets | {config.siteTitle}</title>
	<meta name="description" content={data.metadata.description} />
</svelte:head>

<h1>Liste des Projets</h1>
<section aria-label="Projects">
	{#each data.projects as project (project.slug)}
		<ProjectCard
			slug={project.slug}
			title={project.title}
			date={project.date}
			authors={project.author}
			repo={project.repo}
			link={project.url}
			tags={project.tags}
		/>
	{/each}
</section>

{#if data.tags.length > 0}
	<section aria-label="Tags des projets">
		<h2>Tous les tags</h2>
		<p>
			{#each data.tags as tag, index (tag.slug)}
				<a href={url(tag.slug)}>#{tag.tag} ({tag.count})</a>{index < data.tags.length - 1 ? ' · ' : ''}
			{/each}
		</p>
	</section>
{/if}
