import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { AdminRepository } from '@/src/repositories/admin.repository';
import { login } from '@/src/lib/auth';
import { checkRateLimit } from '@/src/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting based on IP
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { status: 429, message: 'Too many login attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { status: 400, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const admin = await AdminRepository.findByEmail(email);

    // Defense: Use generic error message for both non-existent user and wrong password
    if (!admin) {
      // Fake delay to mitigate timing attacks if necessary, but bcrypt already provides some delay
      return NextResponse.json(
        { status: 401, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password!);

    if (!isPasswordValid) {
      return NextResponse.json(
        { status: 401, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Set JWT in cookie
    await login({ id: String(admin.id), email: admin.email });

    return NextResponse.json(
      { status: 200, message: 'Login successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { status: 500, message: 'An internal error occurred' },
      { status: 500 }
    );
  }
}
