import { NextRequest, NextResponse } from 'next/server';
import { AboutService } from '@/src/services/about.service';

export async function GET() {
  try {
    const result = await AboutService.getAboutData(true);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const result = await AboutService.updateAboutData(data);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message }, { status: 500 });
  }
}
