import { Card } from "@/components/ui/card";

export default function OptimizerLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-5 sm:py-8">
      <Card className="mb-6 rounded-[28px] p-6 sm:p-7">
        <div className="mb-3 h-6 w-36 animate-pulse rounded-full bg-muted" />
        <div className="mb-2 h-8 w-3/4 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
      </Card>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex gap-4">
              <div className="h-6 w-6 animate-pulse rounded-md bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
