import TableSkeleton from '@/src/components/admin/ui/TableSkeleton';

export default function Loading() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <div className="h-10 w-64 bg-surface-container-high rounded-lg animate-pulse" />
        <div className="h-5 w-80 bg-surface-container-high rounded-lg animate-pulse" />
      </div>
      <TableSkeleton rowCount={8} columnCount={4} />
    </div>
  );
}
