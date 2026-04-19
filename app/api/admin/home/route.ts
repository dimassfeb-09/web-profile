import { NextRequest, NextResponse } from 'next/server';
import { HomeService } from '@/src/services/home.service';
import { requireAuth } from '@/src/lib/auth';
import { z } from 'zod';

const HomeSchema = z.object({
  badge_text: z.string().min(1).max(100),
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  description: z.string().min(1),
  cv_url: z.string().url(),
});

export async function GET() {
  try {
    await requireAuth();
    const result = await HomeService.getHomeData(true);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Admin Home GET] Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const data = HomeSchema.parse(body);
    const result = await HomeService.updateHomeData(data);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ status: 400, message: error.issues[0].message }, { status: 400 });
    }
    console.error('[Admin Home PUT] Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
  }
}
