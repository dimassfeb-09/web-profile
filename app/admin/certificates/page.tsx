import React from 'react';
import { CertificateService } from '@/src/services/certificate.service';
import CertificateClient from './CertificateClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Certificate Management | Admin',
};

export default async function CertificateManagementPage() {
  // Fetch data directly from the service (Server-side)
  const response = await CertificateService.getAllCertificates(true);
  
  // Map data to ensure serializable types and fix TypeScript 'undefined' warnings
  const mappedData = response.data.map(cert => ({
    id: cert.id || '',
    title: cert.title,
    issuer: cert.issuer,
    issue_date: cert.issue_date ? (cert.issue_date instanceof Date ? cert.issue_date.toISOString() : cert.issue_date) : '',
    credential_url: cert.credential_url,
    image_url: cert.image_url,
    description: cert.description
  }));
  
  return <CertificateClient initialData={mappedData} />;
}
