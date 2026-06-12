import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/src/lib/auth';
import { fetchAnalyticsData } from '@/src/lib/analyticsClient';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // 1. Authorize requests by checking the admin session cookie
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: 'unauthorized', message: 'Unauthorized access' },
      { status: 401 }
    );
  }

  const propertyId = process.env.GA_PROPERTY_ID;
  const credentialsJson = process.env.GA_SERVICE_ACCOUNT_CREDENTIALS;

  // 2. Check configuration and return 503 if not set
  if (!propertyId || !credentialsJson || propertyId.trim() === '' || credentialsJson.trim() === '') {
    return NextResponse.json(
      { error: 'analytics_not_configured' },
      { status: 503 }
    );
  }

  try {
    // 3. Fetch report data
    const period = request.nextUrl.searchParams.get('period') || '30days';
    const data = await fetchAnalyticsData(propertyId, credentialsJson, period);

    // 4. Return successful response with caching headers
    const response = NextResponse.json(data);
    response.headers.set('Cache-Control', 'private, max-age=300');
    return response;
  } catch (error) {
    const err = error as Error;
    console.error('Analytics Route Error:', err);

    if (
      err.message === 'credentials_invalid_json' ||
      err.message === 'credentials_missing_fields'
    ) {
      return NextResponse.json(
        { error: 'analytics_not_configured' },
        { status: 503 }
      );
    }

    if (err.message === 'invalid_response_schema') {
      return NextResponse.json(
        { error: 'analytics_api_error', message: 'Google Analytics response schema mismatch' },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: 'analytics_api_error', message: err.message || 'Internal connection failure' },
      { status: 502 }
    );
  }
}
