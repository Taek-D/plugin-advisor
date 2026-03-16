import OptimizerApp from "@/components/OptimizerApp";

export const metadata = {
  title: "Plugin Optimizer - Claude Code Plugin Advisor",
  description: "Analyze your Claude Code plugin combination",
};

export default function OptimizerPage() {
  return (
    <main className="min-h-screen">
      <OptimizerApp />
    </main>
  );
}
