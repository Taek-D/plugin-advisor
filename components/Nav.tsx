"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PLUGINS } from "@/lib/plugins";
import { useI18n } from "@/lib/i18n";
import AuthButton from "./AuthButton";

export default function Nav() {
  const pathname = usePathname();
  const { locale, t, setLocale } = useI18n();

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/plugins", label: t.nav.plugins },
    { href: "/community", label: t.nav.community },
  ];

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
          {Object.keys(PLUGINS).length} {t.nav.pluginCount}
        </span>
        <div className="flex gap-1">
          {links.map((link) => {
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
      <div className="flex items-center gap-2">
        <button
          onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
          className="rounded-[5px] border border-border-main px-2 py-1 font-mono text-[9px] text-text-sub transition-colors hover:border-accent hover:text-accent"
        >
          {locale === "ko" ? "EN" : "KO"}
        </button>
        <AuthButton />
      </div>
    </nav>
  );
}
