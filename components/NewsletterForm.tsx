"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";

type SubmitStatus = "idle" | "success" | "error";

export default function NewsletterForm() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        setStatus("success");
        trackEvent("newsletter_subscribe");
      } else {
        setStatus("error");
        trackEvent("newsletter_error");
      }
    } catch {
      setStatus("error");
      trackEvent("newsletter_error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md text-center">
      <h2 className="mb-2 text-xl font-bold text-foreground">
        {t.newsletter.sectionTitle}
      </h2>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        {t.newsletter.sectionDesc}
      </p>

      {status === "success" ? (
        <p className="text-sm font-medium text-primary">{t.newsletter.successMsg}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.newsletter.placeholder}
            disabled={submitting}
            className="flex-1 rounded-full px-4"
            required
          />
          <Button
            type="submit"
            disabled={!email.trim() || submitting}
            className="rounded-full px-6"
          >
            {submitting ? t.newsletter.submitting : t.newsletter.submit}
          </Button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-2 text-xs text-destructive">{t.newsletter.errorMsg}</p>
      )}

      <p className="mt-3 text-xs text-muted-foreground">{t.newsletter.privacyNote}</p>
    </div>
  );
}
