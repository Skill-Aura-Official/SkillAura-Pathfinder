import { Skeleton } from "@/components/ui/skeleton";

export function StatCardSkeleton() {
  return (
    <div className="surface-card-inset p-3 space-y-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-3 rounded-full" />
      </div>
      <Skeleton className="h-7 w-24" />
    </div>
  );
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="surface-card-inset p-4 space-y-3">
      <Skeleton className="h-4 w-24" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
    </div>
  );
}

export function QuestCardSkeleton() {
  return (
    <div className="surface-card-inset p-4 space-y-2.5">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-8 rounded" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function DashboardHomeSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="space-y-3">
          <Skeleton className="h-3 w-24" />
          <QuestCardSkeleton />
          <QuestCardSkeleton />
        </div>
        <Skeleton className="h-72 rounded-2xl" />
        <div className="space-y-3">
          <CardSkeleton rows={3} />
          <CardSkeleton rows={3} />
        </div>
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      <Skeleton className="h-16 w-3/4 rounded-2xl" />
      <Skeleton className="h-20 w-2/3 rounded-2xl ml-auto" />
      <Skeleton className="h-24 w-3/4 rounded-2xl" />
    </div>
  );
}
