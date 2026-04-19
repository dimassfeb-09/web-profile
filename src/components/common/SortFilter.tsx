'use client';

import React, { Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/src/lib/utils';

function SortFilterContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = (searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest') as 'newest' | 'oldest';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSort === 'newest') {
      params.delete('sort');
    } else {
      params.set('sort', newSort);
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative group min-w-[140px]">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/60 group-hover:text-primary transition-colors">
        <span className="material-symbols-outlined text-lg">
          {currentSort === 'newest' ? 'schedule' : 'history'}
        </span>
      </div>
      <select
        value={currentSort}
        onChange={handleSortChange}
        suppressHydrationWarning
        className={cn(
          "w-full pl-11 pr-10 py-2.5 rounded-2xl appearance-none cursor-pointer",
          "bg-surface-container-low border border-outline-variant/10 text-on-surface text-sm font-label font-medium",
          "hover:bg-surface-container-high hover:border-primary/20 transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
        )}
      >
        <option value="newest">Terbaru</option>
        <option value="oldest">Terlama</option>
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/40">
        <span className="material-symbols-outlined text-lg">expand_more</span>
      </div>
    </div>
  );
}

export default function SortFilter() {
  return (
    <Suspense fallback={
      <div className="h-11 w-40 animate-pulse bg-surface-container-low border border-outline-variant/10 rounded-2xl"></div>
    }>
      <SortFilterContent />
    </Suspense>
  );
}
