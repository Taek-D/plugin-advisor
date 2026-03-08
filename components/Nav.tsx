"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PLUGINS } from "@/lib/plugins";
import AuthButton from "./AuthButton";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/plugins", label: "Plugins" },
  { href: "/community", label: "Community" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between border-b border-[#121224] px-4 py-4 sm:px-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent shadow-[0_0_8px_#3030FF]" />
          <span className="font-heading text-[11px] font-extrabold tracking-[1.5px] sm:text-[13px] sm:tracking-[2.5px]">
            PLUGIN ADVISOR
          </span>
        </Link>
        <span className="hidden rounded-[3px] border border-[#181848] bg-[#080820] px-1.5 py-0.5 text-[9px] text-accent sm:inline">
          {Object.keys(PLUGINS).length} plugins
        </span>
        <div className="flex gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-[5px] px-2.5 py-1.5 font-mono text-[10px] tracking-wide transition-colors ${
                  isActive
                    ? "bg-[#101028] text-[#CCC]"
                    : "text-text-sub hover:text-[#CCC]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
      <AuthButton />
    </nav>
  );
}
