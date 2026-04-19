'use server';

import { CertificateService } from '@/src/services/certificate.service';
import { revalidateTag } from 'next/cache';

export async function createCertificateAction(data: {
  title: string;
  issuer: string;
  issue_date: string;
  credential_url: string | null;
  image_url: string | null;
  description: string;
}) {
  try {
    const result = await CertificateService.createCertificate(data);
    revalidateTag('certificates', { expire: 0 });
    return result;
  } catch (error: any) {
    return { status: 500, message: error.message || 'Failed to create certificate' };
  }
}

export async function updateCertificateAction(id: string, data: Partial<{
  title: string;
  issuer: string;
  issue_date: string;
  credential_url: string | null;
  image_url: string | null;
  description: string;
}>) {
  try {
    const result = await CertificateService.updateCertificate(id, data);
    revalidateTag('certificates', { expire: 0 });
    revalidateTag(`certificate_${id}`, { expire: 0 });
    return result;
  } catch (error: any) {
    return { status: 500, message: error.message || 'Failed to update certificate' };
  }
}

export async function deleteCertificateAction(id: string) {
  try {
    const result = await CertificateService.deleteCertificate(id);
    revalidateTag('certificates', { expire: 0 });
    revalidateTag(`certificate_${id}`, { expire: 0 });
    return result;
  } catch (error: any) {
    return { status: 500, message: error.message || 'Failed to delete certificate' };
  }
}
