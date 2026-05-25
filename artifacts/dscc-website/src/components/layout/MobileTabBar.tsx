import { Link, useLocation } from "wouter";
import { Home, Wrench, Briefcase, Phone, FileText } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

const TABS = [
  { href: "/", key: "nav.home", Icon: Home },
  { href: "/services", key: "nav.services", Icon: Wrench },
  { href: "/projects", key: "nav.projects", Icon: Briefcase },
  { href: "/quote", key: "nav.quote", Icon: FileText, accent: true },
  { href: "/contact", key: "nav.contact", Icon: Phone },
];

export function MobileTabBar() {
  const [location] = useLocation();
  const { t } = useLanguage();

  return (
    <nav
      aria-label="Mobile navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border/60 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.15)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5 max-w-md mx-auto">
        {TABS.map(({ href, key, Icon, accent }) => {
          const active =
            href === "/" ? location === "/" : location === href || location.startsWith(href + "/");
          return (
            <li key={href} className="flex">
              <Link
                href={href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                  active
                    ? "text-primary"
                    : accent
                    ? "text-primary"
                    : "text-foreground/65 hover:text-foreground"
                }`}
              >
                <span
                  className={`grid place-items-center transition-all ${
                    accent
                      ? "size-10 -mt-5 rounded-full bg-gradient-to-br from-primary to-[#6e1432] text-primary-foreground shadow-lg ring-4 ring-background"
                      : "size-6"
                  }`}
                >
                  <Icon className={accent ? "size-5" : "size-5"} strokeWidth={active ? 2.4 : 1.8} />
                </span>
                <span className={accent ? "text-[10px] font-semibold" : ""}>{t(key)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
