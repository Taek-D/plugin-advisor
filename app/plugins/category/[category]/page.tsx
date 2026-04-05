import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PLUGINS } from "@/lib/plugins";
import { CATEGORY_META, ALL_CATEGORY_SLUGS } from "@/lib/category-meta";
import type { PluginCategory } from "@/lib/types";
import { breadcrumbSchema, itemListSchema, wrapGraph } from "@/lib/schema";
import CategoryPluginList from "./CategoryPluginList";

type Props = {
  params: { category: string };
};

export function generateStaticParams() {
  return ALL_CATEGORY_SLUGS.map((slug) => ({ category: slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const meta = CATEGORY_META[params.category as PluginCategory];
  if (!meta) return {};

  return {
    title: `${meta.seoTitle} | Plugin Advisor`,
    description: meta.description,
    openGraph: {
      title: `${meta.seoTitle} | Plugin Advisor`,
      description: meta.descriptionEn,
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const cat = params.category as PluginCategory;
  const meta = CATEGORY_META[cat];
  if (!meta) notFound();

  const plugins = Object.entries(PLUGINS)
    .filter(([, p]) => p.category === cat)
    .map(([id, p]) => ({ id, name: p.name, desc: p.desc, type: p.type }));

  const jsonLd = wrapGraph([
    breadcrumbSchema([
      { name: "Home", url: "https://pluginadvisor.cc" },
      { name: "Plugins", url: "https://pluginadvisor.cc/plugins" },
      { name: meta.labelEn, url: `https://pluginadvisor.cc/plugins/category/${cat}` },
    ]),
    itemListSchema(
      plugins.map((p) => ({
        name: p.name,
        url: `https://pluginadvisor.cc/plugins/${p.id}`,
      }))
    ),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/plugins" className="hover:text-foreground">
          Plugins
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{meta.labelEn}</span>
      </nav>

      <CategoryPluginList meta={meta} plugins={plugins} category={cat} />

      <nav className="mt-12 border-t border-border pt-6">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          Other categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORY_SLUGS.filter((s) => s !== cat).map((s) => (
            <Link
              key={s}
              href={`/plugins/category/${s}`}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {CATEGORY_META[s].labelEn}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
