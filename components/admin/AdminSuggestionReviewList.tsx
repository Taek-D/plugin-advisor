"use client";

import type { PluginSuggestion } from "@/lib/types";
import AdminSuggestionReviewCard from "./AdminSuggestionReviewCard";

type Props = {
  items: PluginSuggestion[];
};

export default function AdminSuggestionReviewList({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-[24px] border border-overlay-border bg-overlay-subtle px-5 py-8 text-center text-sm text-muted-foreground">
        조건에 맞는 제안이 아직 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <AdminSuggestionReviewCard key={item.id} item={item} />
      ))}
    </div>
  );
}
