import { NextRequest, NextResponse } from 'next/server';
import { AchievementService } from '@/src/services/achievement.service';
import { requireAuth } from '@/src/lib/auth';
import { z } from 'zod';

const AchievementSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug only contains lowercase, numbers and hyphens'),
  description: z.string().min(1),
  image_url: z.string().url().nullable(),
  date: z.string().nullable(),
  event_organizer: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  team_members: z.array(z.string()).nullable().optional(),
  tech_stack: z.array(z.string()).nullable().optional(),
  problem_statement: z.string().nullable().optional(),
  solution_overview: z.string().nullable().optional(),
  credential_url: z.string().url().nullable().optional(),
  image_hash: z.string().nullable().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const data = AchievementSchema.partial().parse(body);
    const result = await AchievementService.updateAchievement(id, data);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ status: 400, message: error.issues[0].message }, { status: 400 });
    }
    console.error('[Admin Achievement PUT] Error:', error);
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
    const result = await AchievementService.deleteAchievement(id);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Admin Achievement DELETE] Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
  }
}
