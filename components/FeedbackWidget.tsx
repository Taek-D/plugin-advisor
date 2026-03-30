"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";

type FeedbackType = "bug" | "feature" | "other";
type SubmitStatus = "idle" | "success" | "error";

export default function FeedbackWidget() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("bug");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  function handleOpen() {
    setOpen(true);
    trackEvent("feedback_open");
  }

  function handleClose() {
    setOpen(false);
    setStatus("idle");
    setMessage("");
    setType("bug");
    setRating(0);
    setHoverRating(0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message: message.trim(),
          page: window.location.pathname,
          rating: rating > 0 ? rating : null,
        }),
      });

      if (res.ok) {
        setStatus("success");
        trackEvent("feedback_submit", { type });
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  const typeOptions: { value: FeedbackType; label: string }[] = [
    { value: "bug", label: t.feedback.typeBug },
    { value: "feature", label: t.feedback.typeFeature },
    { value: "other", label: t.feedback.typeOther },
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={handleOpen}
        aria-label={t.feedback.buttonLabel}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
      >
        <MessageSquare className="h-4 w-4" />
        {t.feedback.buttonLabel}
      </button>

      {/* Slide-up drawer */}
      <div
        className={`fixed bottom-16 right-4 z-50 w-80 rounded-[20px] border border-border bg-background p-5 shadow-xl transition-all duration-300 sm:right-6 ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {t.feedback.panelTitle}
          </h2>
          <button
            onClick={handleClose}
            aria-label={t.feedback.close}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {status === "success" ? (
          <p className="py-4 text-center text-sm font-medium text-primary">
            {t.feedback.successMsg}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Type selector */}
            <div className="flex gap-2">
              {typeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setType(opt.value)}
                  className={`flex-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    type === opt.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground mr-2">{t.feedback.ratingLabel}</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`text-lg transition-colors ${
                    star <= (hoverRating || rating)
                      ? "text-yellow-500"
                      : "text-muted-foreground/30"
                  }`}
                  aria-label={`${star} star`}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Message */}
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.feedback.messagePlaceholder}
              maxLength={500}
              rows={3}
              className="resize-none rounded-xl text-sm"
              disabled={submitting}
            />

            {/* Error */}
            {status === "error" && (
              <p className="text-xs text-destructive">{t.feedback.errorMsg}</p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              size="sm"
              disabled={!message.trim() || submitting}
              className="w-full rounded-full"
            >
              {submitting ? t.feedback.submitting : t.feedback.submit}
            </Button>
          </form>
        )}
      </div>
    </>
  );
}
