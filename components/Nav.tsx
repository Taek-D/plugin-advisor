"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PLUGINS } from "@/lib/plugins";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


export default function Nav() {
  const pathname = usePathname();
  const { locale, t, setLocale } = useI18n();

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/advisor", label: t.nav.advisor },
    { href: "/plugins", label: t.nav.plugins },
  ];

  return (
    <nav className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3 overflow-hidden sm:gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
          <span className="font-heading text-xs font-bold tracking-wider sm:text-sm">
            PLUGIN ADVISOR
          </span>
        </Link>
        <Badge variant="outline" className="hidden sm:inline-flex">
          {Object.keys(PLUGINS).length} {t.nav.pluginCount}
        </Badge>
        <div className="flex gap-0.5 sm:gap-1">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "cursor-pointer rounded-sm px-3 py-2.5 text-sm transition-colors sm:px-2.5 sm:py-1.5 sm:text-xs",
                  isActive
                    ? "bg-card text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="xs"
          onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
          aria-label={locale === "ko" ? "Switch to English" : "한국어로 전환"}
          className="text-muted-foreground hover:border-primary hover:text-primary"
        >
          {locale === "ko" ? "EN" : "KO"}
        </Button>
      </div>
    </nav>
  );
}
