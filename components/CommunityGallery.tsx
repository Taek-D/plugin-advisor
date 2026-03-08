"use client";

import { useState, useEffect } from "react";
import { PLUGINS } from "@/lib/plugins";
import type { User } from "@supabase/supabase-js";
import ShareComboForm from "./ShareComboForm";
import AuthButton from "./AuthButton";

function getClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
    return null;
  const { createClient } = require("@/lib/supabase/client");
  return createClient();
}

type SharedCombo = {
  id: string;
  title: string;
  description: string | null;
  plugin_ids: string[];
  github_username: string;
  avatar_url: string | null;
  created_at: string;
  user_id: string;
};

type Props = {
  initialCombos: SharedCombo[];
};

export default function CommunityGallery({ initialCombos }: Props) {
  const [combos, setCombos] = useState<SharedCombo[]>(initialCombos);
  const [user, setUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getClient();
    if (!supabase) return;

    supabase.auth
      .getUser()
      .then(({ data }: { data: { user: User | null } }) =>
        setUser(data.user)
      );

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: string, session: { user: User } | null) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const refreshCombos = async () => {
    const supabase = getClient();
    if (!supabase) return;
    const { data } = await supabase
      .from("shared_combos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setCombos(data);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    const supabase = getClient();
    if (!supabase) return;
    await supabase.from("shared_combos").delete().eq("id", id);
    setCombos((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCopy = (pluginIds: string[]) => {
    const script = [
      "# Claude Code 플러그인 설치 스크립트",
      "",
      ...pluginIds.flatMap((id) => {
        const p = PLUGINS[id];
        return p ? [`# ── ${p.name}`, ...p.install, ""] : [];
      }),
    ].join("\n");
    navigator.clipboard.writeText(script);
    setCopied(pluginIds.join(","));
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mb-1.5 font-heading text-[18px] font-extrabold sm:text-[22px]">
            커뮤니티 조합
          </h1>
          <p className="text-[11px] text-[#484860]">
            다른 개발자들이 공유한 플러그인 조합을 둘러보세요.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AuthButton />
          {user && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-[5px] bg-accent/20 px-3 py-1.5 font-mono text-[10px] font-bold text-accent hover:bg-accent/30"
            >
              {showForm ? "취소" : "+ 조합 공유"}
            </button>
          )}
        </div>
      </div>

      {showForm && user && (
        <div className="mb-6">
          <ShareComboForm user={user} onShared={refreshCombos} />
        </div>
      )}

      {combos.length === 0 ? (
        <div className="rounded-[9px] border border-border-main bg-card px-4 py-12 text-center">
          <div className="text-[11px] text-text-sub">
            아직 공유된 조합이 없어요
          </div>
          <div className="mt-1 text-[10px] text-[#303048]">
            첫 번째로 나만의 플러그인 조합을 공유해보세요!
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {combos.map((combo) => (
            <div
              key={combo.id}
              className="rounded-[9px] border border-border-main bg-card p-4"
            >
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#CCC]">
                    {combo.title}
                  </h3>
                  {combo.description && (
                    <p className="mt-0.5 text-[10px] text-[#666]">
                      {combo.description}
                    </p>
                  )}
                </div>
                {user?.id === combo.user_id && (
                  <button
                    onClick={() => handleDelete(combo.id)}
                    className="shrink-0 text-[11px] text-text-sub hover:text-error"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="mb-3 flex flex-wrap gap-1">
                {combo.plugin_ids.map((id) => {
                  const p = PLUGINS[id];
                  if (!p) return null;
                  return (
                    <span
                      key={id}
                      className="rounded-[3px] px-1.5 py-0.5 text-[9px] font-bold"
                      style={{
                        color: p.color,
                        background: p.color + "14",
                        border: `1px solid ${p.color}28`,
                      }}
                    >
                      {p.tag}
                    </span>
                  );
                })}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {combo.avatar_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={combo.avatar_url}
                      alt=""
                      className="h-4 w-4 rounded-full"
                    />
                  )}
                  <span className="text-[9px] text-[#555]">
                    {combo.github_username}
                  </span>
                  <span className="text-[9px] text-[#303048]">
                    {new Date(combo.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(combo.plugin_ids)}
                  className="rounded border border-border-main px-2 py-1 font-mono text-[9px] text-text-sub hover:border-accent hover:text-accent"
                >
                  {copied === combo.plugin_ids.join(",")
                    ? "Copied"
                    : "Copy Script"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
