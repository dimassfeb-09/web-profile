import { env } from '$env/dynamic/private';
import { SignJWT, jwtVerify } from 'jose';
import type { Cookies } from '@sveltejs/kit';

export const COOKIE_NAME = 'admin-token';

export interface AuthPayload {
	id: string;
	email: string;
	role?: string;
	[key: string]: any;
}

// JWT_SECRET is required in ALL environments (including development)
// Read lazily so the module loads during builds where the env var isn't set
function getSecret(): Uint8Array {
	const jwtSecretValue = env.JWT_SECRET;
	if (!jwtSecretValue) {
		throw new Error(
			'FATAL: JWT_SECRET environment variable is not set. Please add JWT_SECRET to your .env file.'
		);
	}
	return new TextEncoder().encode(jwtSecretValue);
}

export async function encrypt(payload: AuthPayload) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('24h') // Token valid for 24 hours
		.sign(getSecret());
}

export async function decrypt(input: string): Promise<AuthPayload> {
	const { payload } = await jwtVerify(input, getSecret(), {
		algorithms: ['HS256'],
	});
	return payload as unknown as AuthPayload;
}

const baseCookieOptions = {
	httpOnly: true,
	secure: env.NODE_ENV === 'production',
	sameSite: 'strict' as const,
	path: '/',
};

export async function login(cookies: Cookies, payload: AuthPayload) {
	const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
	const session = await encrypt(payload);
	cookies.set(COOKIE_NAME, session, { ...baseCookieOptions, expires });
}

export async function logout(cookies: Cookies) {
	cookies.delete(COOKIE_NAME, { path: '/' });
}

export async function getSession(cookies: Cookies): Promise<AuthPayload | null> {
	const session = cookies.get(COOKIE_NAME);
	if (!session) return null;
	try {
		return await decrypt(session);
	} catch {
		return null;
	}
}

/**
 * Checks if the user is authenticated, throws an error if not.
 */
export async function requireAuth(cookies: Cookies): Promise<AuthPayload> {
	const session = await getSession(cookies);
	if (!session) {
		throw new Error('UNAUTHORIZED');
	}
	return session;
}