<script lang="ts">
	import type { PageProps } from './$types';
	import * as config from '$lib/config';

	import PostNavigation from '$lib/components/PostNavigation.svelte';
	import TagList from '$lib/components/TagList.svelte';

	let { data }: PageProps = $props();

	const post = $derived(data.post);
	const previousPost = $derived(data.previousPost);
	const nextPost = $derived(data.nextPost);
	const metadata = $derived(post.metadata);
	const Content = $derived(post.component);
</script>

<svelte:head>
	<title>{metadata.title ? `${metadata.title} | ${config.siteTitle}` : config.siteTitle}</title>
	<meta name="description" content={metadata.description || config.siteDescription} />
</svelte:head>

<Content />

<TagList tags={metadata.tags} />

<PostNavigation {previousPost} {nextPost} />
