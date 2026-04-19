import { NextRequest, NextResponse } from 'next/server';
import { CertificateService } from '@/src/services/certificate.service';
import { requireAuth } from '@/src/lib/auth';
import { z } from 'zod';

const CertificateSchema = z.object({
  title: z.string().min(1).max(255),
  issuer: z.string().min(1).max(255),
  issue_date: z.string().nullable(),
  credential_url: z.string().url().nullable().or(z.literal('')),
  image_url: z.string().url().nullable().or(z.literal('')),
});

export async function GET() {
  try {
    await requireAuth();
    const result = await CertificateService.getAllCertificates(true);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Admin Certificate GET] Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const data = CertificateSchema.parse(body);
    const result = await CertificateService.createCertificate(data);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ status: 400, message: error.issues[0].message }, { status: 400 });
    }
    console.error('[Admin Certificate POST] Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
  }
}
