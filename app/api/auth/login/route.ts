import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { AdminRepository } from '@/src/repositories/admin.repository';
import { login } from '@/src/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { status: 400, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const admin = await AdminRepository.findByEmail(email);

    if (!admin) {
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
    await login({ id: admin.id, email: admin.email });

    return NextResponse.json(
      { status: 200, message: 'Login successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { status: 500, message: 'An extra internal error occurred' },
      { status: 500 }
    );
  }
}
