import { NextRequest, NextResponse } from 'next/server';
import { decrypt, COOKIE_NAME, updateSession } from './lib/auth';

const PROTECTED_ROUTES = ['/admin', '/api/admin']; // Add protected API routes here
const AUTH_ROUTES = ['/admin/login'];

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const path = nextUrl.pathname;

  // 1. Check if the current route is protected (startsWith /admin)
  const isProtectedRoute = path.startsWith('/admin') && !AUTH_ROUTES.includes(path);
  const isAuthRoute = AUTH_ROUTES.includes(path);
  
  // Also protect API routes starting with /api/admin
  const isProtectedApiRoute = path.startsWith('/api/admin');

  const cookie = request.cookies.get(COOKIE_NAME)?.value;

  if (isProtectedRoute || isProtectedApiRoute) {
    if (!cookie) {
      if (isProtectedApiRoute) {
        return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const res = await updateSession(request);
      return res || NextResponse.next();
    } catch (error) {
      if (isProtectedApiRoute) {
        return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 2. Redirect to dashboard if already logged in and trying to access login page
  if (isAuthRoute && cookie) {
    try {
      await decrypt(cookie);
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } catch (error) {
      // Invalid cookie, let them stay on login page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ],
};
