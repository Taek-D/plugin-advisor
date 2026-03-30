"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shareResult } from "@/lib/share-utils";
import { trackEvent } from "@/lib/analytics";
import { useI18n } from "@/lib/i18n";

export default function ShareResultButton() {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const outcome = await shareResult(window.location.href, t.share.title);
    trackEvent("result_share", { outcome });
    if (outcome === "clipboard") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 mr-1.5" />
          {t.share.copied}
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5 mr-1.5" />
          {t.share.button}
        </>
      )}
    </Button>
  );
}
