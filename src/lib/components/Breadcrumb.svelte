<script lang="ts">
	import { page } from '$app/state';
	import { navItems } from '$lib/config';
	
	interface BreadcrumbItem {
		title: string;
		href: string;
	}
	
	// Build the breadcrumb from the current URL
	let breadcrumbs = $derived.by(() => {
		const path = page.url.pathname;
		const items: BreadcrumbItem[] = [];
		
		// Always add "Accueil" as the first item
		items.push({ title: 'Accueil', href: '/' });
		
		// Show nothing else when we are at the root path
		if (path === '/') {
			return items;
		}
		
		// Split the path into segments
		const segments = path.split('/').filter(Boolean);
		let currentPath = '';
		
		segments.forEach((segment, index) => {
			currentPath += `/${segment}`;
			
			// Look up the title in navItems
			const navItem = navItems.find(item => item.route === currentPath);
			
			// If this is the last segment and page metadata exists
			if (index === segments.length - 1 && page.data?.metadata?.title) {
				items.push({
					title: page.data.metadata.title,
					href: currentPath
				});
			}
			// Otherwise use navItem title or format the segment
			else {
				const title = navItem?.title || segment
					.split('-')
					.map(word => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' ');
				
				items.push({
					title,
					href: currentPath
				});
			}
		});
		
		return items;
	});
</script>

{#if breadcrumbs.length > 1}
	<nav aria-label="Fil d'Ariane">
		<ol>
			{#each breadcrumbs as item, index (item.href)}
				<li aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}>
					{#if index === breadcrumbs.length - 1}
						<span>{item.title}</span>
					{:else}
						<a href={item.href}>{item.title}</a>
					{/if}
				</li>
			{/each}
		</ol>
	</nav>
{/if}

<style>
	nav ol {
		display: flex;
		flex-wrap: wrap;
		list-style: none;
		padding: 0;
		gap: 0.5rem;
	}
	
	nav li:not(:last-child)::after {
		content: '›';
		margin-left: 0.5rem;
		color: var(--color-text-secondary);
	}
</style>
