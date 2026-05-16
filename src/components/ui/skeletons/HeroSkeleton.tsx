import Skeleton from '@/src/components/admin/ui/Skeleton';

export default function HeroSkeleton() {
  return (
    <section className="min-h-[80dvh] xl:min-h-[716px] flex flex-col items-center justify-center text-center relative pt-12 overflow-hidden animate-fade-in">
      {/* Badge */}
      <Skeleton className="h-8 w-32 rounded-full mb-8" />
      
      {/* Title */}
      <div className="space-y-4 mb-8 w-full max-w-4xl flex flex-col items-center">
        <Skeleton className="h-12 xs:h-16 md:h-20 lg:h-24 w-full rounded-2xl" />
        <Skeleton className="h-12 xs:h-16 md:h-20 lg:h-24 w-3/4 rounded-2xl" />
      </div>

      {/* Description */}
      <div className="space-y-2 mb-12 w-full max-w-2xl flex flex-col items-center">
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-5/6 rounded-lg" />
        <Skeleton className="h-4 w-4/5 rounded-lg" />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
        <Skeleton className="h-14 w-full sm:w-48 rounded-full" />
        <Skeleton className="h-14 w-full sm:w-40 rounded-full" />
      </div>
    </section>
  );
}
