import React from 'react';
import Skeleton from '@/src/components/admin/ui/Skeleton';

interface GridSkeletonProps {
  children: React.ReactNode;
  count?: number;
}

export default function GridSkeleton({ children, count = 3 }: GridSkeletonProps) {
  return (
    <div className="space-y-12 animate-fade-in">
      <div className="space-y-4">
        <Skeleton className="h-10 w-48 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: count }).map((_, i) => (
          <React.Fragment key={i}>
            {children}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
