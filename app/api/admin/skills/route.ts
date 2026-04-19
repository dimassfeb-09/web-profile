import { NextRequest, NextResponse } from 'next/server';
import { SkillService } from '@/src/services/skill.service';
import { requireAuth } from '@/src/lib/auth';
import { z } from 'zod';

const SkillSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1).max(100),
  skills: z.array(z.string().min(1)),
  color_class: z.string().min(1),
  delay_class: z.string().min(1),
});

export async function GET() {
  try {
    await requireAuth();
    const result = await SkillService.getAllSkills(true);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Admin Skill GET] Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const data = SkillSchema.parse(body);
    const result = await SkillService.createSkill(data);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ status: 400, message: error.issues[0].message }, { status: 400 });
    }
    console.error('[Admin Skill POST] Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
  }
}
