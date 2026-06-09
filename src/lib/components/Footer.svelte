<script lang="ts">
	import * as config from '$lib/config';

	const visibleItems = config.navItems.filter((item) => !item.hidden);
</script>

<footer>
	<hr />
	<div class="footer-content">
		<div class="footer-info">
			<p><strong>{config.siteTitle}</strong></p>
			<p><small>{config.siteDescription}</small></p>
			<p><small>Contact: {config.contactInfo}</small></p>
		</div>

		<nav aria-label="Résumé de navigation">
			<p><small>Navigation</small></p>
			<ul>
				{#each visibleItems as item (item.route)}
					<li><a href={item.route}>{item.title}</a></li>
				{/each}
				<li><a href="/rss.xml">RSS</a></li>
			</ul>
		</nav>
	</div>
</footer>

<style>
	.footer-content {
		display: grid;
		grid-template-columns: auto auto;
		gap: 3rem;
		align-items: start;
		justify-content: start;
	}

	@media (max-width: 768px) {
		.footer-content {
			grid-template-columns: 1fr;
		}
	}

	.footer-info p {
		margin: 0.5rem 0;
	}

	nav ul {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		list-style: none;
		padding: 0;
	}

	nav a {
		font-weight: normal;
	}
</style>