<script lang="ts">
	import * as config from '$lib/config';

	const visibleItems = config.navItems.filter((item) => !item.hidden);
</script>

<footer>
	<hr />
	<p><strong>{config.siteTitle}</strong></p>
	<p><small>{config.siteDescription}</small></p>
	<p><small>Contact: {config.contactInfo}</small></p>

	<nav aria-label="Résumé de navigation">
		<p><small>Navigation</small></p>
		<ul>
			{#each visibleItems as item (item.route)}
				<li><a href={item.route}>{item.title}</a></li>
			{/each}
		</ul>
	</nav>
</footer>

<style>
	nav ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		list-style: none;
		padding: 0;
	}
</style>