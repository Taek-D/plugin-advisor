import type { MetadataRoute } from "next";
import { PLUGINS } from "@/lib/plugins";
import { STARTER_GUIDES } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://pluginadvisor.cc", lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: "https://pluginadvisor.cc/advisor", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: "https://pluginadvisor.cc/plugins", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: "https://pluginadvisor.cc/guides", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://pluginadvisor.cc/services", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: "https://pluginadvisor.cc/optimizer", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const pluginPages: MetadataRoute.Sitemap = Object.keys(PLUGINS).map((id) => ({
    url: `https://pluginadvisor.cc/plugins/${id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const guidePages: MetadataRoute.Sitemap = STARTER_GUIDES.map((g) => ({
    url: `https://pluginadvisor.cc/guides/${g.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...pluginPages, ...guidePages];
}
