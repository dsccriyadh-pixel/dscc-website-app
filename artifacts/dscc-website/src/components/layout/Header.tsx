import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV: { href: string; key: string }[] = [
  { href: "/", key: "nav.home" },
  { href: "/about", key: "nav.about" },
  { href: "/services", key: "nav.services" },
  { href: "/sectors", key: "nav.sectors" },
  { href: "/projects", key: "nav.projects" },
  { href: "/clients", key: "nav.clients" },
  { href: "/resources", key: "nav.resources" },
  { href: "/contact", key: "nav.contact" },
];

export function Header() {
  const { lang, setLang, t } = useLanguage();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-serif text-2xl font-semibold tracking-tight text-primary">
            DSCC
          </span>
          <span className="hidden md:inline text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {t("brand.tagline")}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm">
          {NAV.slice(1).map((n) => {
            const active = location === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`transition-colors hover:text-primary ${
                  active ? "text-primary font-medium" : "text-foreground/75"
                }`}
              >
                {t(n.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="gap-2"
          >
            <Globe className="size-4" />
            {lang === "en" ? "العربية" : "English"}
          </Button>
          <Link href="/quote">
            <Button>{t("nav.quote")}</Button>
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[320px]">
            <div className="flex flex-col gap-1 mt-8">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-md hover:bg-muted text-base"
                >
                  {t(n.key)}
                </Link>
              ))}
              <div className="mt-4 flex items-center gap-2 px-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLang(lang === "en" ? "ar" : "en")}
                  className="gap-2 flex-1"
                >
                  <Globe className="size-4" />
                  {lang === "en" ? "العربية" : "English"}
                </Button>
              </div>
              <Link href="/quote" onClick={() => setOpen(false)} className="px-3 mt-3">
                <Button className="w-full">{t("nav.quote")}</Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
