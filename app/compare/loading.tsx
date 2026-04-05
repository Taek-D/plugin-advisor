export default function CompareLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 max-w-3xl">
        <div className="mb-3 h-5 w-28 animate-pulse rounded-full bg-muted" />
        <div className="mb-3 h-8 w-2/3 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card/50 p-5">
            <div className="mb-3 h-5 w-40 animate-pulse rounded bg-muted" />
            <div className="space-y-1.5">
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
