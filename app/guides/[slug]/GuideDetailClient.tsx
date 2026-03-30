"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { StarterGuide } from "@/lib/guides";
import { useI18n } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NewsletterForm from "@/components/NewsletterForm";

type Props = {
  guide: StarterGuide;
};

export default function GuideDetailClient({ guide }: Props) {
  const { locale } = useI18n();

  useEffect(() => {
    trackEvent("guide_view", { slug: guide.slug });
  }, [guide.slug]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Button variant="outline" size="xs" asChild className="mb-6">
        <Link href="/guides">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          {locale === "en" ? "Back to guides" : "가이드 목록으로"}
        </Link>
      </Button>

      <Badge variant="outline" className="mb-3 text-primary">
        {locale === "en" ? guide.categoryEn : guide.category}
      </Badge>
      <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
        {locale === "en" ? guide.titleEn : guide.title}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
        {locale === "en" ? guide.summaryEn : guide.summary}
      </p>

      <div className="mt-8 space-y-4">
        {guide.sections.map((section) => (
          <Card key={section.heading} className="p-5">
            <h2 className="font-heading text-xl font-bold text-foreground">
              {locale === "en" ? section.headingEn : section.heading}
            </h2>
            <div className="mt-3 space-y-3">
              {(locale === "en" ? section.bodyEn : section.body).map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Newsletter */}
      <section className="mt-16 mb-8 rounded-2xl border border-border bg-muted/30 px-6 py-10">
        <NewsletterForm />
      </section>
    </main>
  );
}
