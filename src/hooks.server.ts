import { redirect, type Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { COOKIE_NAME, decrypt } from '$lib/auth';

const AUTH_ROUTES = ['/admin/login'];

const isProtectedPage = (path: string) => path.startsWith('/admin') && !AUTH_ROUTES.includes(path);
const isProtectedApi = (path: string) => path.startsWith('/api/admin');
const isAuthRoute = (path: string) => AUTH_ROUTES.includes(path);

const SECURITY_HEADERS: Record<string, string> = {
	'X-DNS-Prefetch-Control': 'on',
	'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
	'X-Frame-Options': 'SAMEORIGIN',
	'X-Content-Type-Options': 'nosniff',
	'X-XSS-Protection': '1; mode=block',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
	'Content-Security-Policy': [
		"default-src 'self'",
		// Note: 'unsafe-inline' required for SSR/JS bundle injection - can be hardened with nonce in future
		"script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
		...(dev ? ["worker-src 'self' blob:"] : []),
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		"font-src 'self' https://fonts.gstatic.com",
		"img-src 'self' data: blob: https://atgnqunmelvquqdwkmnq.supabase.co https://lh3.googleusercontent.com",
		"connect-src 'self' https://atgnqunmelvquqdwkmnq.supabase.co https://www.google-analytics.com https://*.giphy.com",
		"frame-ancestors 'none'"
	].join('; ')
};

export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;
	const cookie = event.cookies.get(COOKIE_NAME);

	if (event.url.host === 'dimassfeb.com') {
		throw redirect(301, `https://www.dimassfeb.com${event.url.pathname}${event.url.search}`);
	}

	if (isProtectedPage(path) || isProtectedApi(path)) {
		if (!cookie) {
			if (isProtectedApi(path)) {
				return new Response(JSON.stringify({ status: 401, message: 'Unauthorized' }), {
					status: 401,
					headers: { 'content-type': 'application/json' }
				});
			}
			throw redirect(303, '/admin/login');
		}

		try {
			await decrypt(cookie);
		} catch {
			if (isProtectedApi(path)) {
				return new Response(JSON.stringify({ status: 401, message: 'Unauthorized' }), {
					status: 401,
					headers: { 'content-type': 'application/json' }
				});
			}
			throw redirect(303, '/admin/login');
		}
	}

	if (isAuthRoute(path) && cookie) {
		try {
			await decrypt(cookie);
			throw redirect(303, '/admin/dashboard');
		} catch {
			// invalid cookie, let them stay on the login page
		}
	}

	const response = await resolve(event);
	for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
		response.headers.set(key, value);
	}

	return response;
};