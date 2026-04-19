import React, { Suspense } from 'react';
import { AchievementService } from '@/src/services/achievement.service';
import AchievementSection from '@/src/components/sections/AchievementSection';
import SortFilter from '@/src/components/common/SortFilter';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Achievements | Dimas Febriyanto',
  description: 'Recognition and milestones attained throughout my journey.',
};

const SectionSkeleton = () => (
  <div className="w-full h-96 bg-surface-container-low/50 animate-pulse rounded-[2rem] border border-outline-variant/10" />
);

export default async function AchievementsPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const sort = (searchParams.sort === 'oldest' ? 'oldest' : 'newest') as 'newest' | 'oldest';

  const response = await AchievementService.getAllAchievements(false, sort);
  const achievements = response.data || [];

  return (
    <main className="pt-24 lg:pt-32 px-6 md:px-12 lg:px-16 2xl:px-24 max-w-[1920px] mx-auto pb-20">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link 
          href="/#achievements" 
          className="flex items-center gap-2 text-primary font-label font-medium hover:underline"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Kembali ke Beranda
        </Link>
        <SortFilter />
      </div>
      
      <Suspense fallback={<SectionSkeleton />}>
        <AchievementSection achievements={achievements} />
      </Suspense>
    </main>
  );
}
