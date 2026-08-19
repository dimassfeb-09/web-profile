import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { requireAuth } from '$lib/auth';
import { fetchAnalyticsData } from '$lib/analyticsClient';

export async function GET({ url, cookies }) {
	try {
		await requireAuth(cookies);
	} catch {
		return json({ error: 'unauthorized', message: 'Unauthorized access' }, { status: 401 });
	}

	const propertyId = env.GA_PROPERTY_ID;
	const credentialsJson = env.GA_SERVICE_ACCOUNT_CREDENTIALS;

	if (!propertyId || !credentialsJson || propertyId.trim() === '' || credentialsJson.trim() === '') {
		return json({ error: 'analytics_not_configured' }, { status: 503 });
	}

	try {
		const period = url.searchParams.get('period') || '30days';
		const data = await fetchAnalyticsData(propertyId, credentialsJson, period);

		return json(data, { headers: { 'Cache-Control': 'private, max-age=300' } });
	} catch (error) {
		const err = error as Error;
		console.error('Analytics Route Error:', err);

		if (
			err.message === 'credentials_invalid_json' ||
			err.message === 'credentials_missing_fields'
		) {
			return json({ error: 'analytics_not_configured' }, { status: 503 });
		}

		if (err.message === 'invalid_response_schema') {
			return json(
				{ error: 'analytics_api_error', message: 'Google Analytics response schema mismatch' },
				{ status: 502 }
			);
		}

		return json(
			{ error: 'analytics_api_error', message: err.message || 'Internal connection failure' },
			{ status: 502 }
		);
	}
}