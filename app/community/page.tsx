import type { Metadata } from "next";
import CommunityGallery from "@/components/CommunityGallery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community — Plugin Advisor",
  description:
    "다른 개발자들이 공유한 Claude Code 플러그인 조합을 둘러보세요.",
};

export default async function CommunityPage() {
  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!hasSupabase) {
    return (
      <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-6">
        <CommunityGallery initialCombos={[]} />
      </div>
    );
  }

  const { createReadOnlyClient } = await import("@/lib/supabase/server");
  const supabase = createReadOnlyClient();

  const { data: combos } = await supabase
    .from("shared_combos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-6">
      <CommunityGallery initialCombos={combos ?? []} />
    </div>
  );
}
