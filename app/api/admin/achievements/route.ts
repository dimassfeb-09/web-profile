import { NextRequest, NextResponse } from 'next/server';
import { AchievementService } from '@/src/services/achievement.service';
import { requireAuth } from '@/src/lib/auth';
import { z } from 'zod';

const AchievementSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  image_url: z.string().url().nullable(),
  date: z.string().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const sort = (searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest') as 'newest' | 'oldest';
    const result = await AchievementService.getAllAchievements(true, sort);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Admin Achievement GET] Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const data = AchievementSchema.parse(body);
    const result = await AchievementService.createAchievement(data);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ status: 400, message: error.issues[0].message }, { status: 400 });
    }
    console.error('[Admin Achievement POST] Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
  }
}
