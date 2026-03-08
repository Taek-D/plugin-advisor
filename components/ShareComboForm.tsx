"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PLUGINS } from "@/lib/plugins";
import type { User } from "@supabase/supabase-js";

type Props = {
  user: User;
  onShared: () => void;
};

export default function ShareComboForm({ user, onShared }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedIds = Object.keys(selected).filter((k) => selected[k]);
  const meta = user.user_metadata;

  const handleSubmit = async () => {
    if (!title.trim() || !selectedIds.length) return;
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("shared_combos")
      .insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        plugin_ids: selectedIds,
        github_username:
          meta?.user_name ?? meta?.preferred_username ?? "anonymous",
        avatar_url: meta?.avatar_url ?? null,
      });

    setSubmitting(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }

    setTitle("");
    setDescription("");
    setSelected({});
    onShared();
  };

  return (
    <div className="rounded-[9px] border border-border-main bg-card p-4">
      <div className="mb-3 text-[9px] tracking-[2px] text-[#383850]">
        SHARE YOUR COMBO
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="조합 제목 (필수)"
        maxLength={100}
        className="mb-2 w-full rounded-md border border-border-main bg-[#060610] px-3 py-2 font-mono text-xs text-[#CCC] outline-none placeholder:text-[#252540] focus:border-accent"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="설명 (선택)"
        maxLength={500}
        rows={2}
        className="mb-3 w-full rounded-md border border-border-main bg-[#060610] px-3 py-2 font-mono text-xs text-[#CCC] outline-none placeholder:text-[#252540] focus:border-accent"
        style={{ resize: "none" }}
      />

      <div className="mb-3">
        <div className="mb-1.5 text-[10px] text-[#484860]">
          플러그인 선택 ({selectedIds.length}개)
        </div>
        <div className="flex flex-wrap gap-1">
          {Object.values(PLUGINS).map((p) => (
            <button
              key={p.id}
              onClick={() =>
                setSelected((s) => ({ ...s, [p.id]: !s[p.id] }))
              }
              className="rounded-[3px] px-1.5 py-0.5 text-[9px] font-bold transition-all"
              style={{
                color: selected[p.id] ? "#fff" : p.color,
                background: selected[p.id] ? p.color : p.color + "14",
                border: `1px solid ${selected[p.id] ? p.color : p.color + "28"}`,
              }}
            >
              {p.tag}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-2 rounded-[5px] border border-[#301010] bg-[#120808] px-3 py-2 text-[11px] text-[#FF6060]">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!title.trim() || !selectedIds.length || submitting}
        className="w-full rounded-[7px] bg-gradient-to-br from-accent to-[#7C3AED] px-3 py-3 font-mono text-xs font-bold tracking-[1.5px] text-white transition-all hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-30"
      >
        {submitting ? "공유 중..." : "커뮤니티에 공유"}
      </button>
    </div>
  );
}
