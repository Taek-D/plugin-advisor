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
    { href: "/optimizer", label: t.nav.optimizer },
    {
      href: "/services",
      label: locale === "en" ? "Setup support" : "세팅 지원",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-background/72 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-3 overflow-hidden sm:gap-4">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
              </div>
              <div className="min-w-0">
                <div className="font-heading text-xs font-bold tracking-[0.24em] text-foreground sm:text-sm">
                  PLUGIN ADVISOR
                </div>
                <div className="hidden text-[11px] text-muted-foreground sm:block">
                  {locale === "en"
                    ? "Starter setup, not plugin clutter"
                    : "플러그인 과시보다 세팅 성공"}
                </div>
              </div>
            </Link>

            <Button
              variant="outline"
              size="xs"
              onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
              aria-label={locale === "ko" ? "Switch to English" : "영어에서 한국어로 전환"}
              className="border-white/10 bg-card/55 text-muted-foreground hover:border-primary hover:text-primary md:hidden"
            >
              {locale === "ko" ? "EN" : "KO"}
            </Button>
          </div>

          <div className="flex items-center gap-2 md:flex-1 md:justify-end">
            <div className="no-scrollbar -mx-1 overflow-x-auto px-1 md:mx-0 md:px-0">
              <div className="inline-flex min-w-max rounded-full border border-white/10 bg-card/55 p-1">
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
                        "cursor-pointer whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-medium transition-colors",
                        isActive
                          ? "bg-primary/12 text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <Badge
              variant="outline"
              className="hidden border-white/10 bg-card/50 text-muted-foreground md:inline-flex"
            >
              {Object.keys(PLUGINS).length} {t.nav.pluginCount}
            </Badge>

            <Button
              variant="outline"
              size="xs"
              onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
              aria-label={locale === "ko" ? "Switch to English" : "영어에서 한국어로 전환"}
              className="hidden border-white/10 bg-card/55 text-muted-foreground hover:border-primary hover:text-primary md:inline-flex"
            >
              {locale === "ko" ? "EN" : "KO"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
