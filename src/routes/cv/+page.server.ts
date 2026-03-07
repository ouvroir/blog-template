import type { PageServerLoad } from './$types';
import { ORCID_CLIENT_ID, ORCID_CLIENT_SECRET } from '$env/static/private';

import * as config from '$lib/config';

export const load: PageServerLoad = async () => {
	const orcidData = config.orcidId ? await fetchOrcidProfile(config.orcidId) : null;

	return {
		metadata: {
			title: 'Curriculum Vitae',
			description: 'My CV and academic profile'
		},
		orcidProfile: orcidData
	};
};

/**
 * Gets an OAuth2 access token for ORCID API
 */
async function getOrcidAccessToken(): Promise<string | null> {
	if (!ORCID_CLIENT_ID || !ORCID_CLIENT_SECRET) {
		console.warn('ORCID credentials not configured');
		return null;
	}

	try {
		// Base64 encode credentials for Basic Auth (server-side compatible)
		const credentials = btoa(`${ORCID_CLIENT_ID}:${ORCID_CLIENT_SECRET}`);
		
		const response = await fetch('https://orcid.org/oauth/token', {
			method: 'POST',
			headers: {
				'Authorization': `Basic ${credentials}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: 'grant_type=client_credentials&scope=/read-public'
		});

		if (!response.ok) {
			console.error('Failed to get ORCID access token:', response.statusText);
			return null;
		}

		const data = await response.json();
		return data.access_token;
	} catch (error) {
		console.error('Error getting ORCID access token:', error);
		return null;
	}
}

/**
 * Fetches public ORCID profile data with OAuth2 authentication
 */
async function fetchOrcidProfile(orcidId: string): Promise<OrcidProfile> {
	if (!orcidId) {
		return { error: 'ORCID ID not provided' };
	}

	try {
		// Get access token
		const accessToken = await getOrcidAccessToken();
		
		if (!accessToken) {
			// Fallback to unauthenticated API if credentials not available
			console.warn('Using unauthenticated ORCID API');
			return fetchOrcidProfileUnauthenticated(orcidId);
		}

		const response = await fetch(
			`https://pub.orcid.org/v3.0/${orcidId}`,
			{
				headers: {
					'Accept': 'application/json',
					'Authorization': `Bearer ${accessToken}`
				}
			}
		);

		if (!response.ok) {
			return { error: `Failed to fetch ORCID profile: ${response.statusText}` };
		}

		const data = await response.json();

		// Extract relevant data from ORCID's complex response structure
		const profile: OrcidProfile = {
			name: extractName(data),
			biography: extractBiography(data),
			email: extractEmail(data),
			affiliations: extractAffiliations(data),
			works: extractWorks(data),
			urls: extractUrls(data)
		};

		return profile;
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : 'Unknown error fetching ORCID profile';
		return {
			error: errorMsg
		};
	}
}

/**
 * Fallback: Fetches ORCID profile without authentication (public API, rate-limited)
 */
async function fetchOrcidProfileUnauthenticated(orcidId: string): Promise<OrcidProfile> {
	try {
		const response = await fetch(
			`https://pub.orcid.org/v3.0/${orcidId}`,
			{
				headers: {
					'Accept': 'application/json'
				}
			}
		);

		if (!response.ok) {
			return { error: `Failed to fetch ORCID profile: ${response.statusText}` };
		}

		const data = await response.json();

		const profile: OrcidProfile = {
			name: extractName(data),
			biography: extractBiography(data),
			email: extractEmail(data),
			affiliations: extractAffiliations(data),
			works: extractWorks(data),
			urls: extractUrls(data)
		};

		return profile;
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : 'Unknown error fetching ORCID profile';
		return {
			error: errorMsg
		};
	}
}

function extractName(data: any): string | undefined {
	const givenNames = data?.person?.['name']?.['given-names']?.['value'];
	const familyName = data?.person?.['name']?.['family-name']?.['value'];
	return givenNames && familyName ? `${givenNames} ${familyName}` : undefined;
}

function extractBiography(data: any): string | undefined {
	// Try new structure first: .person.biography.content
	return data?.person?.['biography']?.['content'] || 
		// Fallback to old structure: .person.biography.biography.value
		data?.person?.['biography']?.['biography']?.['value'];
}

function extractEmail(data: any): string | undefined {
	return data?.person?.['emails']?.['email']?.[0]?.['email']?.['value'];
}

function extractAffiliations(data: any): OrcidAffiliation[] {
	const affiliations: OrcidAffiliation[] = [];
	const employmentGroups = data?.['activities-summary']?.['employments']?.['affiliation-group'];

	if (Array.isArray(employmentGroups)) {
		// Each affiliation-group contains summaries array
		for (const group of employmentGroups) {
			const summaries = group?.['summaries'];
			if (Array.isArray(summaries)) {
				for (const summary of summaries) {
					const emp = summary?.['employment-summary'];
					if (emp) {
						affiliations.push({
							title: emp?.['role-title'],
							organization: emp?.['organization']?.['name'],
							startDate: emp?.['start-date']?.['year']?.['value'],
							endDate: emp?.['end-date']?.['year']?.['value']
						});
					}
				}
			}
		}
	}

	// Sort by start date (most recent first)
	return affiliations.sort((a, b) => {
		const dateA = a.startDate ? parseInt(a.startDate) : 0;
		const dateB = b.startDate ? parseInt(b.startDate) : 0;
		return dateB - dateA;
	});
}

function extractWorks(data: any): OrcidWork[] {
	const works: OrcidWork[] = [];
	const worksGroups = data?.['activities-summary']?.['works']?.['group'];

	if (Array.isArray(worksGroups)) {
		// Each group contains work-summary array
		for (const group of worksGroups) {
			const workSummaries = group?.['work-summary'];
			if (Array.isArray(workSummaries) && workSummaries.length > 0) {
				// Take the first work-summary from each group
				const work = workSummaries[0];
				works.push({
					title: work?.['title']?.['title']?.['value'],
					type: work?.['type'],
					date: work?.['publication-date']?.['year']?.['value'],
					url: work?.['url']?.['value'],
					doi: extractDoi(work)
				});
			}
		}
	}

	// Limit to first 10 works and sort by date (most recent first)
	return works
		.filter(w => w.title) // Only keep works with titles
		.sort((a, b) => {
			const dateA = a.date ? parseInt(a.date) : 0;
			const dateB = b.date ? parseInt(b.date) : 0;
			return dateB - dateA;
		})
		.slice(0, 10);
}

function extractDoi(work: any): string | undefined {
	const externalIds = work?.['external-ids']?.['external-id'];
	if (Array.isArray(externalIds)) {
		const doiId = externalIds.find((id: any) => id['external-id-type'] === 'doi');
		return doiId?.['external-id-value'];
	}
	return undefined;
}

function extractUrls(data: any): OrcidUrl[] {
	const urls: OrcidUrl[] = [];
	const researcherUrls = data?.['person']?.['researcher-urls']?.['researcher-url'];

	if (Array.isArray(researcherUrls)) {
		urls.push(
			...researcherUrls.map((url: any) => ({
				name: url?.['url-name'],
				url: url?.['url']?.['value']
			}))
		);
	}

	return urls;
}

