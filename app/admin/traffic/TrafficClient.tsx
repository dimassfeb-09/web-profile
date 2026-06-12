'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AnalyticsDashboard from '@/src/components/admin/AnalyticsDashboard';

export default function TrafficClient() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        setIsMounted(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface mb-2 tracking-tight">Traffic & Analytics</h1>
          <p className="font-body text-on-surface-variant opacity-80">Pantau statistik pengunjung, asal traffic, dan halaman terpopuler portfolio Anda.</p>
        </div>
        <div className="flex items-center gap-4">
          {isMounted && (
            <p className="hidden sm:block text-[10px] font-label font-bold text-on-surface-variant/40 uppercase tracking-widest">
              Last Updated: {new Date().toLocaleTimeString()}
            </p>
          )}
          <button 
            onClick={() => {
              router.refresh();
              setRefreshKey((prev) => prev + 1);
            }} 
            className="p-3 rounded-2xl bg-surface-container-high text-on-surface-variant hover:text-primary transition-all flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest shadow-sm hover:shadow active:scale-95"
            title="Refresh Data"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      <AnalyticsDashboard refreshKey={refreshKey} />
    </div>
  );
}
