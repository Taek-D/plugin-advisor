"use client";

import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import type { Review, ReviewStats } from "@/lib/types";
import StarRating from "./StarRating";

type Props = {
  pluginId: string;
};

export default function ReviewSection({ pluginId }: Props) {
  const { locale, t } = useI18n();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ avgRating: 0, totalCount: 0 });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const loadReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?pluginId=${pluginId}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setStats(data.stats || { avgRating: 0, totalCount: 0 });
    } catch {
      // Ignore transient read failures and preserve the current UI.
    }
  }, [pluginId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleSubmit = useCallback(async () => {
    if (!rating) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pluginId, rating, comment }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error(t.review.loginRequired);
        }

        throw new Error(data.error || t.review.saveError);
      }

      setSuccess(true);
      setRating(0);
      setComment("");
      setTimeout(() => setSuccess(false), 2000);
      await loadReviews();
    } catch (e) {
      setError(e instanceof Error ? e.message : t.review.loginRequired);
    } finally {
      setSubmitting(false);
    }
  }, [
    comment,
    loadReviews,
    pluginId,
    rating,
    t.review.loginRequired,
    t.review.saveError,
  ]);

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <div className="text-[9px] tracking-[2px] text-[#444]">{t.review.title}</div>
        {stats.totalCount > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating value={Math.round(stats.avgRating)} size="sm" readonly />
            <span className="text-[10px] text-[#888]">
              {stats.avgRating} ({stats.totalCount})
            </span>
          </div>
        )}
      </div>

      <div className="mb-4 rounded-[7px] border border-border-main bg-card p-3">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[10px] text-[#555]">{t.review.rating}</span>
          <StarRating value={rating} onChange={setRating} size="sm" />
        </div>
        <textarea
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t.review.placeholder}
          maxLength={500}
          className="mb-2 w-full rounded border border-border-main bg-[#060610] px-2.5 py-2 font-mono text-[11px] text-[#CCC] outline-none placeholder:text-[#252540] focus:border-accent"
          style={{ resize: "none" }}
        />
        <div className="flex items-center justify-between">
          {error && <span className="text-[10px] text-[#FF6060]">{error}</span>}
          {success && (
            <span className="text-[10px] text-success">{t.review.success}</span>
          )}
          {!error && !success && <span />}
          <button
            onClick={handleSubmit}
            disabled={!rating || submitting}
            className="rounded-[5px] bg-accent/20 px-3 py-1.5 font-mono text-[9px] font-bold text-accent hover:bg-accent/30 disabled:opacity-30"
          >
            {submitting ? t.review.submitting : t.review.submit}
          </button>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div className="flex flex-col gap-2">
          {reviews.slice(0, 10).map((review) => (
            <div
              key={review.id}
              className="rounded-[5px] border border-[#121224] bg-[#060610] px-3 py-2.5"
            >
              <div className="mb-1 flex items-center gap-2">
                {review.user_avatar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={review.user_avatar}
                    alt=""
                    className="h-4 w-4 rounded-full"
                  />
                )}
                <span className="text-[10px] font-bold text-[#888]">
                  {review.user_name}
                </span>
                <StarRating value={review.rating} size="sm" readonly />
                <span className="text-[9px] text-[#333]">
                  {new Date(review.created_at).toLocaleDateString(
                    locale === "en" ? "en-US" : "ko-KR"
                  )}
                </span>
              </div>
              {review.comment && (
                <p className="text-[11px] leading-[1.7] text-[#666]">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center text-[11px] text-[#333]">
          {t.review.noReviews}
        </div>
      )}
    </div>
  );
}
