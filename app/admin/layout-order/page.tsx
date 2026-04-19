import React from 'react';
import { SectionOrderService } from '@/src/services/section_order.service';
import SectionOrderClient from '@/src/components/admin/layout-order/SectionOrderClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Layout & Section Order | Admin',
};

export default async function LayoutOrderPage() {
  const result = await SectionOrderService.getAllSections(true);
  
  if (!result.data) {
    return (
      <div className="p-10 text-center bg-surface-container-low rounded-[2rem] border border-outline-variant/10">
        <p className="text-on-surface-variant font-body">Gagal memuat data section. Silakan coba lagi nanti.</p>
        <p className="text-xs text-error mt-2">{result.message}</p>
      </div>
    );
  }

  return <SectionOrderClient initialSections={result.data} />;
}
