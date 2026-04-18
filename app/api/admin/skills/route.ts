import { NextRequest, NextResponse } from 'next/server';
import { SkillService } from '@/src/services/skill.service';

export async function GET() {
  try {
    const result = await SkillService.getAllSkills(true);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const result = await SkillService.createSkill(data);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message }, { status: 500 });
  }
}
