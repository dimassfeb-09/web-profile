import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-at-least-32-chars-long'
);

export const COOKIE_NAME = 'admin-token';

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // Token valid for 24 hours
    .sign(secret);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, secret, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function login(payload: any) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt(payload);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, session, { 
    expires, 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', { expires: new Date(0), path: '/' });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  if (!session) return null;
  return await decrypt(session);
}

/**
 * Updates the session expiry if necessary (sliding session)
 */
export async function updateSession(request: NextRequest) {
  const session = request.cookies.get(COOKIE_NAME)?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: COOKIE_NAME,
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
