import { Card } from "@/components/ui/card";

export default function AdvisorLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-5 sm:py-8">
      <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_20rem]">
        <Card className="rounded-[28px] p-6 sm:p-7">
          <div className="mb-3 h-6 w-40 animate-pulse rounded-full bg-muted" />
          <div className="mb-2 h-8 w-3/4 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="mt-5 flex gap-2">
            <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-6 w-28 animate-pulse rounded-full bg-muted" />
          </div>
        </Card>
        <div className="space-y-4">
          <Card className="rounded-[24px] p-5">
            <div className="mb-3 h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
            </div>
          </Card>
          <Card className="rounded-[24px] p-5">
            <div className="mb-3 h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
