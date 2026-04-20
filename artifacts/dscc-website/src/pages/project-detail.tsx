import { Link, useRoute } from "wouter";
import { ArrowRight, MapPin, Calendar, Briefcase } from "lucide-react";
import { useLanguage, useBilingual } from "@/i18n/LanguageProvider";
import { Seo } from "@/components/seo/Seo";
import { getProjectBySlug } from "@/data/projects";
import { services } from "@/data/services";
import { sectors } from "@/data/sectors";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NotFound from "./not-found";

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:slug");
  const slug = params?.slug ?? "";
  const p = getProjectBySlug(slug);
  const { t } = useLanguage();
  const bi = useBilingual();
  const baseUrl = import.meta.env.BASE_URL;

  if (!p) return <NotFound />;

  const sec = sectors.find((s) => s.id === p.sectorId);
  const svcs = services.filter((s) => p.serviceSlugs.includes(s.slug));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: bi(p.title),
    description: bi(p.summary),
    locationCreated: bi(p.location),
    dateCreated: p.year,
    creator: { "@type": "Organization", name: "DSCC Saudi Arabia" },
  };

  return (
    <>
      <Seo title={bi(p.title)} description={bi(p.summary)} path={`/projects/${p.slug}`} jsonLd={jsonLd} />

      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={`${baseUrl.replace(/\/$/, "")}${p.image}`} alt="" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-primary/30" />
        </div>
        <div className="container py-28 text-primary-foreground">
          {sec && <div className="text-xs uppercase tracking-[0.18em] text-secondary mb-3">{bi(sec.name)}</div>}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight max-w-4xl">{bi(p.title)}</h1>
        </div>
      </section>

      <section className="container py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground"><Briefcase className="size-3" />{t("common.client")}</div>
              <div className="text-sm font-medium text-foreground mt-1">{bi(p.client)}</div>
            </div>
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground"><MapPin className="size-3" />{t("common.location")}</div>
              <div className="text-sm font-medium text-foreground mt-1">{bi(p.location)}</div>
            </div>
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground"><Calendar className="size-3" />{t("common.year")}</div>
              <div className="text-sm font-medium text-foreground mt-1">{p.year}</div>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-secondary mb-2">{t("common.scope")}</p>
            <p className="text-foreground/85">{bi(p.scope)}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-secondary mb-2">{t("common.summary")}</p>
            <p className="text-lg text-foreground/85 leading-relaxed">{bi(p.summary)}</p>
          </div>

          {p.narratives && p.narratives.length > 0 && (
            <div className="space-y-5">
              {p.narratives.map((n, i) => (
                <div key={i}>
                  <p className="text-xs uppercase tracking-[0.14em] text-primary mb-2">{t("common.approach")}{i > 0 ? ` ${i + 1}` : ""}</p>
                  <p className="text-foreground/85 leading-relaxed">{bi(n)}</p>
                </div>
              ))}
            </div>
          )}

          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-primary mb-3">{t("common.highlights")}</p>
            <ul className="space-y-2">
              {p.highlights.map((h, i) => (
                <li key={i} className="text-foreground/85 border-l-2 border-primary pl-4">{bi(h)}</li>
              ))}
            </ul>
          </div>

          {p.gallery.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {p.gallery.map((g, i) => (
                <img key={i} src={`${baseUrl.replace(/\/$/, "")}${g}`} alt="" className="aspect-[4/3] w-full object-cover rounded-md border" />
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-secondary mb-3">{t("common.services_delivered")}</p>
              <ul className="space-y-2">
                {svcs.map((s) => (
                  <li key={s.id}><Link href={`/services/${s.slug}`} className="text-sm text-foreground hover:text-primary">{bi(s.name)} →</Link></li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-serif text-lg mb-3">{t("common.plan_similar")}</h3>
              <Link href={`/quote?type=${p.sectorId}`}><Button variant="secondary" className="w-full gap-2">{t("nav.quote")} <ArrowRight className="size-4" /></Button></Link>
            </CardContent>
          </Card>
        </aside>
      </section>
    </>
  );
}
