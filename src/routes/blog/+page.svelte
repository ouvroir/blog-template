<script>
	let { data } = $props();
</script>

<!-- Pour surcharger le SEO du layout, décommentez et personnalisez :
<svelte:head>
	<title>Titre personnalisé</title>
	<meta name="description" content="Description personnalisée" />
	<meta property="og:image" content="/images/blog-cover.jpg" />
</svelte:head>
-->

<h1>Liste des billets</h1>


{#each data.posts as { slug, title, date }}
	<article>
		<p>Title : {title}</p>
		<p>Date : {date}</p>
		<p><a href="blog/{slug}">{slug}</a></p>
	</article>
{/each}
