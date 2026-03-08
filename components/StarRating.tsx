"use client";

import { useState } from "react";

type Props = {
  value: number;
  onChange?: (v: number) => void;
  size?: "sm" | "md";
  readonly?: boolean;
};

export default function StarRating({
  value,
  onChange,
  size = "md",
  readonly = false,
}: Props) {
  const [hover, setHover] = useState(0);

  const starSize = size === "sm" ? "text-xs" : "text-base";
  const gap = size === "sm" ? "gap-0.5" : "gap-1";

  return (
    <div className={`flex items-center ${gap}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hover || value);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            className={`${starSize} transition-colors ${
              readonly ? "cursor-default" : "cursor-pointer"
            } ${filled ? "text-[#F59E0B]" : "text-[#252545]"}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
