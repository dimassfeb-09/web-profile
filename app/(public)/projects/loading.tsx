import Skeleton from "@/src/components/admin/ui/Skeleton";
import ProjectCardSkeleton from "@/src/components/ui/skeletons/ProjectCardSkeleton";

export default function Loading() {
  return (
    <main className="pt-24 lg:pt-32 px-6 md:px-12 lg:px-16 2xl:px-24 max-w-[1920px] mx-auto pb-20">
      {/* BackButton + SortFilter bar */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      {/* ProjectsSection inner layout */}
      <section className="pt-16 xs:pt-24 lg:pt-32 pb-12">
        {/* Section header: title + description left, filter tags right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 xs:mb-16 gap-6">
          <div className="max-w-xl space-y-4">
            <Skeleton className="h-10 xs:h-12 lg:h-14 w-48 rounded-xl" />
            <Skeleton className="h-6 w-80 rounded-lg" />
          </div>
          {/* Filter tag buttons: All + tech tags */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-9 w-14 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-16 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
          </div>
        </div>

        {/* Project cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 xs:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
