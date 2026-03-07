<script lang="ts">
	import type { PageData } from './$types';
	let { data } = $props();
	const { component: Component, frontmatter, slug } = data;
</script>

<Component />
