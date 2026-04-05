import type { MetadataRoute } from "next";
import { PLUGINS } from "@/lib/plugins";
import { STARTER_GUIDES } from "@/lib/guides";
import { ALL_CATEGORY_SLUGS } from "@/lib/category-meta";

export default function sitemap(): MetadataRoute.Sitemap {
  // Use fixed dates to avoid misleading crawlers on every build
  const LAST_CONTENT_UPDATE = "2026-04-05";
  const LAST_PLUGIN_UPDATE = "2026-03-30";

  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://pluginadvisor.cc", lastModified: LAST_CONTENT_UPDATE, changeFrequency: "weekly", priority: 1.0 },
    { url: "https://pluginadvisor.cc/advisor", lastModified: LAST_CONTENT_UPDATE, changeFrequency: "weekly", priority: 0.9 },
    { url: "https://pluginadvisor.cc/plugins", lastModified: LAST_PLUGIN_UPDATE, changeFrequency: "weekly", priority: 0.8 },
    { url: "https://pluginadvisor.cc/guides", lastModified: LAST_CONTENT_UPDATE, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://pluginadvisor.cc/services", lastModified: LAST_CONTENT_UPDATE, changeFrequency: "monthly", priority: 0.6 },
    { url: "https://pluginadvisor.cc/optimizer", lastModified: LAST_PLUGIN_UPDATE, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://pluginadvisor.cc/compare", lastModified: LAST_CONTENT_UPDATE, changeFrequency: "monthly", priority: 0.7 },
  ];

  const pluginPages: MetadataRoute.Sitemap = Object.keys(PLUGINS).map((id) => ({
    url: `https://pluginadvisor.cc/plugins/${id}`,
    lastModified: LAST_PLUGIN_UPDATE,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const guidePages: MetadataRoute.Sitemap = STARTER_GUIDES.map((g) => ({
    url: `https://pluginadvisor.cc/guides/${g.slug}`,
    lastModified: LAST_CONTENT_UPDATE,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const categoryPages: MetadataRoute.Sitemap = ALL_CATEGORY_SLUGS.map((slug) => ({
    url: `https://pluginadvisor.cc/plugins/category/${slug}`,
    lastModified: LAST_PLUGIN_UPDATE,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...pluginPages, ...guidePages, ...categoryPages];
}
