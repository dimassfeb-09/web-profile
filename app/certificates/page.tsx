import React, { Suspense } from 'react';
import { CertificateService } from '@/src/services/certificate.service';
import CertificatesSection from '@/src/components/sections/CertificatesSection';
import SortFilter from '@/src/components/common/SortFilter';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Certificates | Dimas Febriyanto',
  description: 'Certifications and licenses attained throughout my career.',
};

const SectionSkeleton = () => (
  <div className="w-full h-96 bg-surface-container-low/50 animate-pulse rounded-[2rem] border border-outline-variant/10" />
);

export default async function CertificatesPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const sort = (searchParams.sort === 'oldest' ? 'oldest' : 'newest') as 'newest' | 'oldest';

  const response = await CertificateService.getAllCertificates(false, sort);
  const certificates = response.data || [];

  return (
    <main className="pt-24 lg:pt-32 px-6 md:px-12 lg:px-16 2xl:px-24 max-w-[1920px] mx-auto pb-20">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link 
          href="/#certificates" 
          className="flex items-center gap-2 text-primary font-label font-medium hover:underline"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Kembali ke Beranda
        </Link>
        <SortFilter />
      </div>
      
      <Suspense fallback={<SectionSkeleton />}>
        <CertificatesSection certificates={certificates} />
      </Suspense>
    </main>
  );
}
