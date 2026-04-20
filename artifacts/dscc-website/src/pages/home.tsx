import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Download, Sparkles, Building2, Hotel, Home as HomeIcon, Hammer, ChevronRight } from "lucide-react";
import { useLanguage, useBilingual } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Seo, ORG_JSONLD } from "@/components/seo/Seo";
import { sectors } from "@/data/sectors";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { clients } from "@/data/clients";

const sectorIcons: Record<string, any> = {
  residential: HomeIcon,
  commercial: Building2,
  hospitality: Hotel,
  infrastructure: Hammer,
};

export default function Home() {
  const { t } = useLanguage();
  const bi = useBilingual();
  const featured = services.slice(0, 6);
  const featuredProjects = projects.slice(0, 4);
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <>
      <Seo
        title={t("home.hero_title")}
        description={t("home.hero_subtitle")}
        path="/"
        jsonLd={[
          ORG_JSONLD,
          { "@context": "https://schema.org", "@type": "WebSite", name: "DSCC Saudi Arabia", url: typeof window !== "undefined" ? window.location.origin : "" },
        ]}
      />

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={`${baseUrl}img/hero-skyline.png`} alt="" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        </div>
        <div className="container py-32 lg:py-44 text-primary-foreground">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-secondary mb-6">
              <Sparkles className="size-3" /> {t("brand.tagline")}
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight">
              {t("home.hero_title")}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed">
              {t("home.hero_subtitle")}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/quote"><Button size="lg" variant="secondary" className="gap-2">{t("home.hero_cta_quote")}<ArrowRight className="size-4" /></Button></Link>
              <Link href="/contact"><Button size="lg" variant="outline" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">{t("home.hero_cta_specialist")}</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y bg-card">
        <div className="container py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { v: "20+", k: "trust_years" },
            { v: "600+", k: "trust_projects" },
            { v: "4", k: "trust_sectors" },
            { v: "250+", k: "trust_team" },
          ].map((s) => (
            <div key={s.k}>
              <div className="font-serif text-4xl text-primary">{s.v}</div>
              <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground mt-1">{t(`home.${s.k}`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTORS */}
      <section className="container py-24">
        <div className="max-w-2xl mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">{t("home.choose_project")}</h2>
          <p className="text-muted-foreground">{t("home.choose_subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sectors.map((s, i) => {
            const Icon = sectorIcons[s.id] ?? Building2;
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link href={`/sectors/${s.slug}`}>
                  <Card className="group overflow-hidden h-full hover:border-secondary transition cursor-pointer">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img src={`${baseUrl}${s.image}`} alt={bi(s.name)} className="size-full object-cover transition duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                      <div className="absolute bottom-4 left-5 right-5 text-primary-foreground">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-secondary"><Icon className="size-4" /> {bi(s.name)}</div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm text-foreground/80 leading-relaxed mb-3">{bi(s.tagline)}</p>
                      <span className="inline-flex items-center gap-1 text-sm text-primary font-medium">
                        {t("common.explore")} <ChevronRight className="size-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-muted/40 border-y">
        <div className="container py-24">
          <div className="max-w-2xl mb-14">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">{t("home.process_title")}</h2>
            <p className="text-muted-foreground">{t("home.process_subtitle")}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {["design", "supply", "install", "handover", "maintain"].map((k, i) => (
              <div key={k} className="rounded-lg border bg-card p-6">
                <div className="font-serif text-3xl text-secondary mb-3">0{i + 1}</div>
                <div className="text-sm uppercase tracking-[0.14em] text-foreground">{t(`home.process_steps.${k}`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="container py-24">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">{t("home.featured_services")}</h2>
            <p className="text-muted-foreground">{t("home.featured_services_sub")}</p>
          </div>
          <Link href="/services"><Button variant="ghost" className="gap-1">{t("common.view_all")} <ArrowRight className="size-4" /></Button></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((s) => (
            <Link key={s.id} href={`/services/${s.slug}`}>
              <Card className="h-full group hover:border-secondary transition cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-xs uppercase tracking-[0.14em] text-secondary mb-2">{s.category}</div>
                  <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-primary">{bi(s.name)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{bi(s.tagline)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-24">
          <h2 className="font-serif text-3xl md:text-4xl mb-14 max-w-2xl">{t("home.why_us")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {["engineering", "scale", "saudi", "warranty"].map((k) => (
              <div key={k} className="border-l-2 border-secondary pl-6">
                <h3 className="font-serif text-xl mb-2">{t(`home.why_us_items.${k}.title`)}</h3>
                <p className="text-sm text-primary-foreground/75 leading-relaxed">{t(`home.why_us_items.${k}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="container py-24">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">{t("home.featured_projects")}</h2>
            <p className="text-muted-foreground">{t("home.featured_projects_sub")}</p>
          </div>
          <Link href="/projects"><Button variant="ghost" className="gap-1">{t("common.view_all")} <ArrowRight className="size-4" /></Button></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProjects.map((p) => (
            <Link key={p.id} href={`/projects/${p.slug}`}>
              <Card className="group overflow-hidden hover:border-secondary transition cursor-pointer">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={`${baseUrl}${p.image}`} alt={bi(p.title)} className="size-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
                    <span>{bi(p.location)}</span><span>{p.year}</span>
                  </div>
                  <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-primary">{bi(p.title)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{bi(p.summary)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="bg-muted/40 border-y">
        <div className="container py-16">
          <p className="text-center text-xs uppercase tracking-[0.18em] text-muted-foreground mb-8">{t("home.trusted_by")}</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 items-center">
            {clients.slice(0, 12).map((c) => (
              <div key={c.id} className="text-center text-sm font-medium tracking-wider text-foreground/55 border border-border/40 rounded-md py-4">
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BLOCKS */}
      <section className="container py-24 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border bg-card p-8">
          <Sparkles className="size-6 text-secondary mb-4" />
          <h3 className="font-serif text-xl mb-2">{t("home.ai_block_title")}</h3>
          <p className="text-sm text-muted-foreground mb-6">{t("home.ai_block_sub")}</p>
          <Button variant="outline" onClick={() => { const btn = document.querySelector<HTMLButtonElement>("[aria-label='" + t('chatbot.launcher') + "']"); btn?.click(); }}>{t("home.ai_block_cta")}</Button>
        </div>
        <div className="rounded-xl border bg-primary text-primary-foreground p-8">
          <h3 className="font-serif text-xl mb-2">{t("home.quote_block_title")}</h3>
          <p className="text-sm text-primary-foreground/75 mb-6">{t("home.quote_block_sub")}</p>
          <Link href="/quote"><Button variant="secondary">{t("nav.quote")}</Button></Link>
        </div>
        <div className="rounded-xl border bg-card p-8">
          <Download className="size-6 text-secondary mb-4" />
          <h3 className="font-serif text-xl mb-2">{t("home.download_block_title")}</h3>
          <p className="text-sm text-muted-foreground mb-6">{t("home.download_block_sub")}</p>
          <a href={`${baseUrl}downloads/dscc-company-profile.pdf`} download><Button variant="outline">{t("common.download_profile")}</Button></a>
        </div>
      </section>
    </>
  );
}
