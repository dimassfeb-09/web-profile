import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/src/services/project.service';
import { requireAuth } from '@/src/lib/auth';
import { z } from 'zod';

const ProjectSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  image_url: z.string().url(),
  features: z.array(z.string()),
  link_url: z.string().url(),
  link_text: z.string().min(1),
});

// GET all projects 
export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const sort = (searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest') as 'newest' | 'oldest';
    const result = await ProjectService.getAllProjects(true, sort); // Bypass cache for admin
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Admin Project GET] Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const data = ProjectSchema.parse(body);
    const result = await ProjectService.createProject(data);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ status: 400, message: error.issues[0].message }, { status: 400 });
    }
    console.error('[Admin Project POST] Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
  }
}
