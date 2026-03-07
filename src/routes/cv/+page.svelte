<script lang="ts">
	import type { PageProps } from './$types';
	import * as config from '$lib/config';

	let { data }: PageProps = $props();
	const orcidProfile = data.orcidProfile;
</script>

<svelte:head>
	<title>Curriculum vitæ de {orcidProfile?.name} | {config.siteTitle}</title>
	<meta name="description" content={config.siteDescription} />
</svelte:head>


{#if orcidProfile}
	<section class="orcid-section">
		{#if orcidProfile.error}
			<p class="error">⚠️ {orcidProfile.error}</p>
		{:else}
			{#if orcidProfile.name}
				<h1>Curriculum Vitae d'{orcidProfile.name}</h1>
			{:else}
				<h1>Curriculum Vitae</h1>
			{/if}

			<p>
				<a href="https://orcid.org/{config.orcidId}" target="_blank" rel="noopener noreferrer">
					ORCID: {config.orcidId}
				</a>
			</p>

			{#if orcidProfile.biography}
				<div class="biography">
					<h2>Présentation</h2>
					<p>{orcidProfile.biography}</p>
				</div>
			{/if}

			{#if orcidProfile.affiliations && orcidProfile.affiliations.length > 0}
				<div class="affiliations">
					<h2>Emplois</h2>
					<ul>
						{#each orcidProfile.affiliations as affiliation}
							<li>
								<strong>{affiliation.title}</strong>
								{#if affiliation.organization}
									— {affiliation.organization}
								{/if}
								{#if affiliation.startDate}
									<span class="date">
										({affiliation.startDate}
										{#if affiliation.endDate}
											- {affiliation.endDate}
										{:else}
											- present
										{/if})
									</span>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if orcidProfile.works && orcidProfile.works.length > 0}
				<div class="works">
					<h2>Publications récentes</h2>
					<ul>
						{#each orcidProfile.works as work}
							<li>
								<strong>{work.title}</strong>
								{#if work.type}
									<span class="type">({work.type})</span>
								{/if}
								{#if work.date}
									<span class="date">{work.date}</span>
								{/if}
								{#if work.doi}
									<a href="https://doi.org/{work.doi}" target="_blank" rel="noopener noreferrer">
										DOI
									</a>
								{/if}
								{#if work.url}
									<a href={work.url} target="_blank" rel="noopener noreferrer">
										View
									</a>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if orcidProfile.urls && orcidProfile.urls.length > 0}
				<div class="links">
					<h4>Links</h4>
					<ul>
						{#each orcidProfile.urls as url}
							<li>
								{#if url.url}
									<a href={url.url} target="_blank" rel="noopener noreferrer">
										{url.name || url.url}
									</a>
								{:else}
									{url.name}
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		{/if}
	</section>
{/if}
