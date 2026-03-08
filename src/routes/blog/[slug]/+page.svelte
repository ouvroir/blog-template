<script lang="ts">
	import type { PageProps } from './$types';
	
	import * as config from '$lib/config';

	import PostNavigation from '$lib/components/PostNavigation.svelte';
	import TagList from '$lib/components/TagList.svelte';

	let { data }: PageProps = $props();
	let { post, previousPost, nextPost } = $derived(data);
	let metadata = $derived(post.metadata);
	let Component = $derived(post.component);
</script>

<svelte:head>
	<title>{metadata.title ? `${metadata.title} | ${config.siteTitle}` : config.siteTitle}</title>
	<meta name="description" content={metadata.description || config.siteDescription} />
</svelte:head>

<Component />

<TagList tags={metadata.tags} />

<PostNavigation {previousPost} {nextPost} />
