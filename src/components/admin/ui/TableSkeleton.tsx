import Skeleton from './Skeleton';

interface TableSkeletonProps {
  rowCount?: number;
  columnCount?: number;
}

export default function TableSkeleton({
  rowCount = 5,
  columnCount = 4
}: TableSkeletonProps) {
  return (
    <div className="w-full bg-surface border border-outline-variant/10 rounded-[2rem] overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-outline-variant/10 bg-surface-container-low">
        <div className="flex gap-4">
          {Array.from({ length: columnCount }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-outline-variant/5">
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4 sm:p-6 flex items-center gap-4">
            {Array.from({ length: columnCount }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1">
                <Skeleton className="h-4 w-full max-w-[150px]" />
              </div>
            ))}
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
