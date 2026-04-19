import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const jwtSecretValue = process.env.JWT_SECRET;
if (!jwtSecretValue && process.env.NODE_ENV === 'production') {
  throw new Error('FATAL: JWT_SECRET environment variable is not set.');
}

const secret = new TextEncoder().encode(
  jwtSecretValue || 'development-only-secret-defaults-to-32-chars'
);

export const COOKIE_NAME = 'admin-token';

export interface AuthPayload {
  id: string;
  email: string;
  role?: string;
  [key: string]: any;
}

export async function encrypt(payload: AuthPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // Token valid for 24 hours
    .sign(secret);
}

export async function decrypt(input: string): Promise<AuthPayload> {
  const { payload } = await jwtVerify(input, secret, {
    algorithms: ['HS256'],
  });
  return payload as unknown as AuthPayload;
}

export async function login(payload: AuthPayload) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt(payload);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, session, { 
    expires, 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', { 
    expires: new Date(0), 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/' 
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch (err) {
    return null;
  }
}

/**
 * Checks if the user is authenticated, throws an error if not.
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

/**
 * Updates the session expiry if necessary (sliding session)
 */
export async function updateSession(request: NextRequest) {
  const session = request.cookies.get(COOKIE_NAME)?.value;
  if (!session) return;

  try {
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
      name: COOKIE_NAME,
      value: await encrypt(parsed),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: parsed.expires,
      path: '/'
    });
    return res;
  } catch (err) {
    return;
  }
}
