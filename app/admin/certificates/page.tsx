import React from 'react';
import { CertificateService } from '@/src/services/certificate.service';
import CertificateClient from './CertificateClient';
import SortFilter from '@/src/components/common/SortFilter';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Certificate Management | Admin',
};

export default async function CertificateManagementPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const sort = (searchParams.sort === 'oldest' ? 'oldest' : 'newest') as 'newest' | 'oldest';

  // Fetch data directly from the service (Server-side)
  const response = await CertificateService.getAllCertificates(true, sort);
  
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
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <SortFilter />
      </div>
      <CertificateClient initialData={mappedData} />
    </div>
  );
}
