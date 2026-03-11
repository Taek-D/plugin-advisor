import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import {
  isAdminSessionActive,
  normalizeAdminNextPath,
} from "@/lib/admin-session";

type Props = {
  searchParams?: {
    next?: string;
  };
};

export default function AdminLoginPage({ searchParams }: Props) {
  if (isAdminSessionActive()) {
    redirect("/admin/suggestions");
  }

  const nextPath = normalizeAdminNextPath(searchParams?.next);

  return (
    <main className="px-4 py-12 sm:px-6">
      <AdminLoginForm nextPath={nextPath} />
    </main>
  );
}
