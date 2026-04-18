import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/src/services/project.service';

// GET all projects (already exists in public /api/projects, but we can reuse or use this)
export async function GET() {
  try {
    const result = await ProjectService.getAllProjects(true); // Bypass cache for admin
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message }, { status: 500 });
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const result = await ProjectService.createProject(data);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message }, { status: 500 });
  }
}
