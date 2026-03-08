"use client";

import { useState, useEffect, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { useI18n } from "@/lib/i18n";

function getClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
    return null;
  const { createClient } = require("@/lib/supabase/client");
  return createClient();
}

export default function AuthButton() {
  const { t } = useI18n();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: string, session: { user: User } | null) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = useCallback(async () => {
    const supabase = getClient();
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  }, []);

  const handleLogout = useCallback(async () => {
    const supabase = getClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  if (loading) return null;

  if (user) {
    const meta = user.user_metadata;
    return (
      <div className="flex items-center gap-2">
        {meta?.avatar_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={meta.avatar_url}
            alt=""
            className="h-5 w-5 rounded-full"
          />
        )}
        <span className="hidden text-[10px] text-[#888] sm:inline">
          {meta?.user_name ?? meta?.preferred_username ?? "User"}
        </span>
        <button
          onClick={handleLogout}
          className="rounded border border-border-main px-2 py-1 font-mono text-[9px] text-text-sub hover:border-error hover:text-error"
        >
          {t.auth.logout}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="rounded-[5px] border border-border-main px-2.5 py-1.5 font-mono text-[10px] text-text-sub hover:border-[#30306A] hover:text-[#CCC]"
    >
      {t.auth.login}
    </button>
  );
}
