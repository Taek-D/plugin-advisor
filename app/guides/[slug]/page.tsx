import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { STARTER_GUIDES } from "@/lib/guides";
import { articleSchema, breadcrumbSchema, wrapGraph } from "@/lib/schema";
import GuideDetailClient from "./GuideDetailClient";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return STARTER_GUIDES.map((guide) => ({ slug: guide.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const guide = STARTER_GUIDES.find((item) => item.slug === params.slug);
  if (!guide) return {};

  return {
    title: `${guide.title} — Plugin Advisor`,
    description: guide.summary,
  };
}

export default function GuideDetailPage({ params }: Props) {
  const guide = STARTER_GUIDES.find((item) => item.slug === params.slug);
  if (!guide) notFound();

  const jsonLd = wrapGraph([
    articleSchema({
      title: guide.title,
      description: guide.summary,
      url: `https://pluginadvisor.cc/guides/${guide.slug}`,
    }),
    breadcrumbSchema([
      { name: "Home", url: "https://pluginadvisor.cc" },
      { name: "Guides", url: "https://pluginadvisor.cc/guides" },
      { name: guide.titleEn, url: `https://pluginadvisor.cc/guides/${guide.slug}` },
    ]),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <GuideDetailClient guide={guide} />
    </>
  );
}
