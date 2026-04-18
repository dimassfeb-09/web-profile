import { NextRequest, NextResponse } from 'next/server';
import { ExperienceService } from '@/src/services/experience.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bypassCache = searchParams.get('bypassCache') === 'true';

    const result = await ExperienceService.getAllExperiences(bypassCache);
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error', data: null },
      { status: 500 }
    );
  }
}
