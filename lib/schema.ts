const SITE_URL = "https://pluginadvisor.cc";
const SITE_NAME = "Plugin Advisor";

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Claude Code plugin recommendation and combination analysis tool.",
  };
}

export function webSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: ["ko-KR", "en"],
  };
}

export function softwareApplicationSchema() {
  return {
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Recommends verified Claude Code plugin combinations from a database of 51 plugins. Provides conflict detection, 100-point scoring, and one-click install scripts.",
    featureList: [
      "Project-based plugin recommendation",
      "Plugin combination scoring (0-100)",
      "Conflict detection and warnings",
      "Complementary plugin suggestions",
      "One-click install script generation",
      "4 preset starter packs",
    ],
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished ?? "2026-03-01",
    dateModified: opts.dateModified ?? new Date().toISOString().split("T")[0],
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    image: `${SITE_URL}/opengraph-image`,
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    inLanguage: "ko-KR",
  };
}

export function itemListSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function wrapGraph(schemas: Record<string, unknown>[]) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": schemas,
  });
}

export function wrapSingle(schema: Record<string, unknown>) {
  return JSON.stringify({
    "@context": "https://schema.org",
    ...schema,
  });
}
