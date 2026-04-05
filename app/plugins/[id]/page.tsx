import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PLUGINS } from "@/lib/plugins";
import { breadcrumbSchema, wrapSingle } from "@/lib/schema";
import PluginDetail from "@/components/PluginDetail";

type Props = {
  params: { id: string };
};

export function generateStaticParams() {
  return Object.keys(PLUGINS).map((id) => ({ id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const plugin = PLUGINS[params.id];
  if (!plugin) return {};
  return {
    title: `${plugin.name} — Plugin Advisor`,
    description: plugin.desc,
  };
}

export default function PluginDetailPage({ params }: Props) {
  const plugin = PLUGINS[params.id];
  if (!plugin) notFound();

  const jsonLd = wrapSingle(
    breadcrumbSchema([
      { name: "Home", url: "https://pluginadvisor.cc" },
      { name: "Plugins", url: "https://pluginadvisor.cc/plugins" },
      { name: plugin.name, url: `https://pluginadvisor.cc/plugins/${params.id}` },
    ])
  );

  return (
    <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <PluginDetail plugin={plugin} />
    </div>
  );
}
