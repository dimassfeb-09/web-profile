import { NextResponse } from 'next/server';
import { logout } from '@/src/lib/auth';

export async function POST() {
  await logout();
  return NextResponse.json(
    { status: 200, message: 'Logged out successfully' },
    { status: 200 }
  );
}
