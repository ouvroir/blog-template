<script lang="ts">
	import TagList from '$lib/components/TagList.svelte';

	let {
		slug,
		title,
		date,
		tags = []
	}: {
		slug: string;
		title: string;
		date: string;
		tags?: string[];
	} = $props();
</script>

<aside>
	<h2>
		<a href={`/blog/${slug}`}>{title}</a>
	</h2>
	<small><time datetime={date}>{date}</time></small>
	<TagList {tags} />
</aside>

<style>
	h2 {
		margin-top: 0;
	}
</style>
