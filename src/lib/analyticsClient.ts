import * as jose from 'jose';

export interface AnalyticsData {
  pageViews: number;
  activeUsers: number;
  topPages: Array<{ path: string; pageViews: number }>;
  trafficSources: Array<{ source: string; sessions: number }>;
  deviceBreakdown: Array<{ category: string; activeUsers: number }>;
}

interface GA4DimensionValue {
  value?: string;
}

interface GA4MetricValue {
  value?: string;
}

interface GA4Row {
  dimensionValues?: GA4DimensionValue[];
  metricValues?: GA4MetricValue[];
}

interface GA4Report {
  rows?: GA4Row[];
}

interface GA4Response {
  reports: GA4Report[];
}

/**
 * Signs a JWT with the service account credentials and requests an OAuth2 access token from Google.
 */
async function getGoogleAccessToken(clientEmail: string, privateKeyPem: string): Promise<string> {
  const formattedPrivateKey = privateKeyPem.replace(/\\n/g, '\n');
  const privateKey = await jose.importPKCS8(formattedPrivateKey, 'RS256');

  const jwt = await new jose.SignJWT({
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
  })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuer(clientEmail)
    .setAudience('https://oauth2.googleapis.com/token')
    .setExpirationTime('1h')
    .setIssuedAt()
    .sign(privateKey);

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google token endpoint error: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Validates the response from Google Analytics Data API v1.
 */
function validateGA4Response(data: unknown): data is GA4Response {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.reports)) return false;
  if (obj.reports.length !== 4) return false;

  for (const report of obj.reports) {
    if (!report || typeof report !== 'object') return false;
    const repObj = report as Record<string, unknown>;
    if (repObj.rows !== undefined && !Array.isArray(repObj.rows)) return false;
  }
  return true;
}

/**
 * Fetches analytics data from the Google Analytics Data API.
 */
export async function fetchAnalyticsData(
  propertyId: string,
  credentialsJson: string
): Promise<AnalyticsData> {
  let credentials;
  try {
    credentials = JSON.parse(credentialsJson);
  } catch {
    throw new Error('credentials_invalid_json');
  }

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error('credentials_missing_fields');
  }

  const accessToken = await getGoogleAccessToken(
    credentials.client_email,
    credentials.private_key
  );

  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:batchRunReports`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        // 1. Overview (Pageviews and Active Users)
        {
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
        },
        // 2. Top 5 pages
        {
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'pagePath' }],
          metrics: [{ name: 'screenPageViews' }],
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit: 5,
        },
        // 3. Traffic sources (up to 10)
        {
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'sessionSourceMedium' }],
          metrics: [{ name: 'sessions' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 10,
        },
        // 4. Device category breakdown
        {
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'deviceCategory' }],
          metrics: [{ name: 'activeUsers' }],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Data API error: ${response.status} - ${errorText}`);
  }

  const rawData = (await response.json()) as unknown;

  if (!validateGA4Response(rawData)) {
    throw new Error('invalid_response_schema');
  }

  const [repOverview, repTopPages, repTraffic, repDevices] = rawData.reports;

  // Extract Overview (report 1)
  const pageViews = parseInt(repOverview.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
  const activeUsers = parseInt(repOverview.rows?.[0]?.metricValues?.[1]?.value || '0', 10);

  // Extract Top Pages (report 2)
  const topPages = (repTopPages.rows || []).map((row) => ({
    path: row.dimensionValues?.[0]?.value || '',
    pageViews: parseInt(row.metricValues?.[0]?.value || '0', 10),
  }));

  // Extract Traffic Sources (report 3)
  const trafficSources = (repTraffic.rows || []).map((row) => ({
    source: row.dimensionValues?.[0]?.value || '',
    sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
  }));

  // Extract Device Breakdown (report 4)
  const deviceBreakdown = (repDevices.rows || []).map((row) => ({
    category: row.dimensionValues?.[0]?.value || '',
    activeUsers: parseInt(row.metricValues?.[0]?.value || '0', 10),
  }));

  return {
    pageViews,
    activeUsers,
    topPages,
    trafficSources,
    deviceBreakdown,
  };
}
