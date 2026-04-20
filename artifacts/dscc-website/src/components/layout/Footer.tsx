import { Link } from "wouter";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Music2, MessageCircle, Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SOCIAL = [
  { href: "https://www.facebook.com/profile.php?id=100093187917575", label: "Facebook", Icon: Facebook },
  { href: "https://www.instagram.com/dsccsaudia", label: "Instagram", Icon: Instagram },
  { href: "https://twitter.com/dsccsaudia", label: "Twitter", Icon: Twitter },
  { href: "https://www.tiktok.com/@dsccsaudia", label: "TikTok", Icon: Music2 },
  {
    href: "https://api.whatsapp.com/send?phone=966559846519&text=I%27m%20looking%20for%20Solution%20Provider%20(DSCC-WebSite)",
    label: "WhatsApp",
    Icon: MessageCircle,
  },
];

export function Footer() {
  const { t, lang, setLang } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground mt-24">
      <div className="container py-16 grid grid-cols-2 lg:grid-cols-12 gap-10">
        <div className="col-span-2 lg:col-span-4">
          <img
            src={`${import.meta.env.BASE_URL}logo-light.svg`}
            alt="DSCC"
            className="h-10 w-auto mb-4"
          />
          <p className="text-primary-foreground/75 text-sm leading-relaxed max-w-sm">
            {t("footer.company_desc")}
          </p>
          <div className="mt-6 flex items-center gap-3">
            {SOCIAL.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="rounded-full border border-primary-foreground/20 p-2 hover:bg-primary-foreground/10 transition-colors"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2">
          <h4 className="text-xs uppercase tracking-[0.16em] text-primary-foreground/60 mb-4">
            {t("footer.explore")}
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services" className="hover:text-secondary-foreground/90 transition-colors">{t("nav.services")}</Link></li>
            <li><Link href="/sectors" className="hover:text-secondary-foreground/90 transition-colors">{t("nav.sectors")}</Link></li>
            <li><Link href="/projects" className="hover:text-secondary-foreground/90 transition-colors">{t("nav.projects")}</Link></li>
            <li><Link href="/resources" className="hover:text-secondary-foreground/90 transition-colors">{t("nav.resources")}</Link></li>
          </ul>
        </div>

        <div className="col-span-1 lg:col-span-2">
          <h4 className="text-xs uppercase tracking-[0.16em] text-primary-foreground/60 mb-4">
            {t("footer.company")}
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-secondary-foreground/90 transition-colors">{t("nav.about")}</Link></li>
            <li><Link href="/clients" className="hover:text-secondary-foreground/90 transition-colors">{t("nav.clients")}</Link></li>
            <li><Link href="/quote" className="hover:text-secondary-foreground/90 transition-colors">{t("nav.quote")}</Link></li>
            <li><Link href="/contact" className="hover:text-secondary-foreground/90 transition-colors">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div className="col-span-2 lg:col-span-4">
          <h4 className="text-xs uppercase tracking-[0.16em] text-primary-foreground/60 mb-4">
            {t("footer.contact_us")}
          </h4>
          <ul className="space-y-3 text-sm text-primary-foreground/85">
            <li className="flex items-start gap-2">
              <MapPin className="size-4 mt-0.5 shrink-0" />
              123 King Abdulaziz St., Riyadh 12345, Saudi Arabia
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4" />
              <a href="tel:+96611123456578">+966 11 1234 5678</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4" />
              <a href="mailto:contact@dsccarchitecture.com">contact@dsccarchitecture.com</a>
            </li>
          </ul>

          <h4 className="text-xs uppercase tracking-[0.16em] text-primary-foreground/60 mt-8 mb-3">
            {t("footer.newsletter")}
          </h4>
          <p className="text-xs text-primary-foreground/65 mb-3">{t("footer.newsletter_sub")}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget as HTMLFormElement);
              const email = fd.get("email");
              try {
                const list = JSON.parse(localStorage.getItem("dscc_newsletter") || "[]");
                list.push({ email, at: new Date().toISOString() });
                localStorage.setItem("dscc_newsletter", JSON.stringify(list));
              } catch {}
              (e.currentTarget as HTMLFormElement).reset();
            }}
            className="flex gap-2"
          >
            <Input
              type="email"
              required
              name="email"
              placeholder={t("footer.newsletter_placeholder")}
              className="bg-primary-foreground/5 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/40"
            />
            <Button type="submit" variant="outline" size="sm" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              {t("footer.subscribe")}
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} DSCC. {t("footer.rights")} • {t("footer.made_in")}</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary-foreground">{t("footer.privacy")}</a>
            <a href="#" className="hover:text-primary-foreground">{t("footer.terms")}</a>
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="inline-flex items-center gap-1 hover:text-primary-foreground"
            >
              <Globe className="size-3" />
              {lang === "en" ? "العربية" : "English"}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
