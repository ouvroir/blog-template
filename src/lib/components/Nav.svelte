<script lang="ts">
	import { page } from '$app/state';
	import { navItems, siteTitle } from '$lib/config';

	const visibleItems = navItems.filter(item => !item.hidden);
	let pathname = $derived(page.url.pathname);
	const isCurrentRoute = (route: string) =>
		route === '/' ? pathname === '/' : pathname === route || pathname.startsWith(`${route}/`);
</script>

<nav aria-label="Navigation principale">
	<a href="/" aria-label="Accueil">
		<img src="/images/logo.svg" alt={siteTitle} height="60" />
	</a>
	<ul>
		{#each visibleItems as item (item.route)}
			<li>
				<a href={item.route} aria-current={isCurrentRoute(item.route) ? 'page' : undefined}>
					{item.title}
				</a>
			</li>
		{/each}
	</ul>
</nav>
