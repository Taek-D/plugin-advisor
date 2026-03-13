import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PLUGINS } from "@/lib/plugins";
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

  return (
    <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6 lg:px-8">
      <PluginDetail plugin={plugin} />
    </div>
  );
}
