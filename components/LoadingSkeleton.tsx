'use client';

interface LoadingSkeletonProps {
  type?: 'card' | 'text' | 'avatar' | 'list';
  count?: number;
}

export default function LoadingSkeleton({ type = 'card', count = 1 }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="card bg-white animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-neutral-200 rounded-xl" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-neutral-200 rounded w-3/4" />
                <div className="h-4 bg-neutral-200 rounded w-full" />
                <div className="h-4 bg-neutral-200 rounded w-5/6" />
                <div className="flex gap-4 mt-4">
                  <div className="h-4 bg-neutral-200 rounded w-20" />
                  <div className="h-4 bg-neutral-200 rounded w-24" />
                </div>
              </div>
              <div className="w-24 h-24 bg-neutral-200 rounded-2xl" />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-neutral-200 rounded w-full" />
            <div className="h-4 bg-neutral-200 rounded w-5/6" />
            <div className="h-4 bg-neutral-200 rounded w-4/6" />
          </div>
        );

      case 'avatar':
        return (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-12 h-12 bg-neutral-200 rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-neutral-200 rounded w-32" />
              <div className="h-3 bg-neutral-200 rounded w-24" />
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 bg-neutral-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-3 bg-neutral-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </>
  );
}
