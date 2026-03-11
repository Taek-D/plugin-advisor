"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LockKeyhole } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  nextPath: string;
};

export default function AdminLoginForm({ nextPath }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          next: nextPath,
        }),
      });

      const data = (await response.json()) as { error?: string; next?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "로그인에 실패했습니다.");
      }

      router.replace(data.next ?? "/admin/suggestions");
      router.refresh();
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "로그인에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="surface-panel mx-auto max-w-md rounded-[28px] p-6 sm:p-7">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <LockKeyhole className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            관리자 로그인
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            플러그인 제안 검토 화면은 관리자 비밀번호로만 접근할 수 있습니다.
          </p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            관리자 비밀번호
          </label>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호 입력"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-3 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full rounded-full" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              로그인 중...
            </span>
          ) : (
            "검토 화면 열기"
          )}
        </Button>
      </form>
    </Card>
  );
}
