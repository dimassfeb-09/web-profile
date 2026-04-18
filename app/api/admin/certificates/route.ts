import { NextRequest, NextResponse } from 'next/server';
import { CertificateService } from '@/src/services/certificate.service';

export async function GET() {
  try {
    const result = await CertificateService.getAllCertificates(true);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const result = await CertificateService.createCertificate(data);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message }, { status: 500 });
  }
}
