export default function GuidesLoading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 max-w-3xl">
        <div className="mb-3 h-5 w-24 animate-pulse rounded-full bg-muted" />
        <div className="mb-3 h-8 w-2/3 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card/50 p-5">
            <div className="mb-3 h-5 w-16 animate-pulse rounded-full bg-muted" />
            <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-muted" />
            <div className="space-y-1.5">
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
