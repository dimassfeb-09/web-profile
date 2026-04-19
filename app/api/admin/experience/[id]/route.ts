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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const data = ExperienceSchema.partial().parse(body);
    const result = await ExperienceService.updateExperience(parseInt(id), data);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ status: 400, message: error.issues[0].message }, { status: 400 });
    }
    console.error('[Admin Experience PUT] Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const result = await ExperienceService.deleteExperience(parseInt(id));
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Admin Experience DELETE] Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
  }
}
