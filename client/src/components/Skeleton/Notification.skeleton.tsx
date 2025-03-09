import { Skeleton } from "../ui/skeleton";

export const NotificationSkeleton = () => (
  <div className="p-4">
    <div className="flex items-start space-x-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  </div>
);
