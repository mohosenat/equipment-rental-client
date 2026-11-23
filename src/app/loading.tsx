export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header Skeleton */}
      <div className="mb-10 space-y-3">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-9 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
      </div>

      {/* Stats Skeleton */}
      <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="mb-5 h-10 w-10 animate-pulse rounded-xl bg-muted" />
            <div className="mb-3 h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="h-8 w-20 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-6 w-40 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-muted sm:w-36" />
        </div>

        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border-b border-border pb-5 last:border-0"
            >
              <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-muted" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 max-w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-28 animate-pulse rounded bg-muted" />
              </div>

              <div className="hidden h-7 w-20 animate-pulse rounded-full bg-muted sm:block" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3 text-sm text-muted-foreground">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted border-t-yellow-500" />
        Preparing your RENTRO experience...
      </div>
    </div>
  );
}
