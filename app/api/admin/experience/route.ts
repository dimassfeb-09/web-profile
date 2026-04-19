import { NextRequest, NextResponse } from 'next/server';
import { ExperienceService } from '@/src/services/experience.service';
import { requireAuth } from '@/src/lib/auth';
import { z } from 'zod';

const ExperienceSchema = z.object({
  role: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  start_date: z.string().min(1),
  end_date: z.string().nullable(),
  description: z.array(z.string().min(1)),
});

export async function GET() {
  try {
    await requireAuth();
    const result = await ExperienceService.getAllExperiences(true);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Admin Experience GET] Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const data = ExperienceSchema.parse(body);
    const result = await ExperienceService.createExperience(data);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ status: 400, message: error.issues[0].message }, { status: 400 });
    }
    console.error('[Admin Experience POST] Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
  }
}
