import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}

// GET /api/reviews?pluginId=xxx
export async function GET(req: NextRequest) {
  const supabase = createClient();
  if (!supabase) {
    return NextResponse.json({ reviews: [], stats: { avgRating: 0, totalCount: 0 } });
  }

  const pluginId = req.nextUrl.searchParams.get("pluginId");
  if (!pluginId) {
    return NextResponse.json({ error: "pluginId 필요" }, { status: 400 });
  }

  const { data: reviews, error } = await supabase
    .from("plugin_reviews")
    .select("*")
    .eq("plugin_id", pluginId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ reviews: [], stats: { avgRating: 0, totalCount: 0 } });
  }

  const totalCount = reviews?.length || 0;
  const avgRating = totalCount > 0
    ? reviews!.reduce((sum, r) => sum + r.rating, 0) / totalCount
    : 0;

  return NextResponse.json({
    reviews: reviews || [],
    stats: { avgRating: Math.round(avgRating * 10) / 10, totalCount },
  });
}

// POST /api/reviews
export async function POST(req: NextRequest) {
  const supabase = createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase 미설정" }, { status: 503 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const { pluginId, rating, comment } = await req.json();
  if (!pluginId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "유효하지 않은 데이터" }, { status: 400 });
  }

  const { error } = await supabase
    .from("plugin_reviews")
    .upsert(
      {
        plugin_id: pluginId,
        user_id: user.id,
        user_name: user.user_metadata?.user_name || user.email || "익명",
        user_avatar: user.user_metadata?.avatar_url || null,
        rating,
        comment: (comment || "").slice(0, 500),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "plugin_id,user_id" }
    );

  if (error) {
    return NextResponse.json({ error: "리뷰 저장 실패" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
