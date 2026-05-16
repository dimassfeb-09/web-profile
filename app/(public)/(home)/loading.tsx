'use client';

import HeroSkeleton from '@/src/components/ui/skeletons/HeroSkeleton';
import ProjectCardSkeleton from '@/src/components/ui/skeletons/ProjectCardSkeleton';
import Skeleton from '@/src/components/admin/ui/Skeleton';

export default function HomeLoading() {
  return (
    <main className="pt-20 xs:pt-24 lg:pt-32 px-6 xs:px-8 md:px-12 lg:px-16 2xl:px-24 max-w-[1920px] mx-auto flex flex-col gap-12 xs:gap-20 lg:gap-24 xl:gap-32 pb-20 xs:pb-32 animate-fade-in">
        {/* Hero Section */}
        <HeroSkeleton />
        
        {/* About Section Skeleton - Grid Col 12 (5/7) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 xs:gap-12 lg:gap-16 items-start pt-12 xs:pt-16 lg:pt-24">
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <Skeleton className="h-10 xs:h-12 lg:h-16 w-3/4 mb-6 rounded-2xl" />
            <Skeleton className="w-20 h-1 rounded-full" />
          </div>
          <div className="lg:col-span-7 bg-surface-container-lowest p-6 xs:p-8 md:p-12 rounded-[2rem] border border-outline-variant/10">
            <div className="space-y-6">
              <Skeleton className="h-6 w-full rounded-md" />
              <Skeleton className="h-6 w-full rounded-md" />
              <Skeleton className="h-6 w-5/6 rounded-md" />
              <Skeleton className="h-6 w-4/5 rounded-md" />
            </div>
          </div>
        </section>

        {/* Featured Projects Grid Skeleton */}
        <section className="space-y-12">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Skeleton className="h-12 w-64 md:w-96 rounded-2xl" />
            <Skeleton className="h-5 w-80 md:w-[32rem] rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* Experience Section Skeleton */}
        <section className="pt-12 xs:pt-16 lg:pt-24 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl space-y-4">
              <Skeleton className="h-10 xs:h-12 lg:h-16 w-3/4 rounded-2xl" />
              <Skeleton className="h-6 w-full rounded-xl" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-16 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          </div>
          <div className="flex flex-col gap-12">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-surface-container-lowest p-8 md:p-10 rounded-3xl border border-outline-variant/10 space-y-10">
                <div>
                  <Skeleton className="h-10 w-64 mb-2 rounded-xl" />
                  <Skeleton className="h-1 w-12 rounded-full" />
                </div>
                <div className="space-y-4 pl-0 sm:pl-10">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-7 w-48 rounded-lg" />
                    <Skeleton className="h-4 w-32 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-5/6 rounded-md" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
    </main>
  );
}
