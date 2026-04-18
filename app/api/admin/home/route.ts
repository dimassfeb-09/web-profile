import { NextRequest, NextResponse } from 'next/server';
import { HomeService } from '@/src/services/home.service';

export async function GET() {
  try {
    const result = await HomeService.getHomeData(true);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const result = await HomeService.updateHomeData(data);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message }, { status: 500 });
  }
}
