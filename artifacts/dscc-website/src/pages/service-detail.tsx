import { useRoute, Link } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage, useBilingual } from "@/i18n/LanguageProvider";
import { Seo } from "@/components/seo/Seo";
import { getServiceBySlug, services } from "@/data/services";
import { sectors } from "@/data/sectors";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import NotFound from "./not-found";

export default function ServiceDetail() {
  const [, params] = useRoute("/services/:slug");
  const slug = params?.slug ?? "";
  const svc = getServiceBySlug(slug);
  const { t } = useLanguage();
  const bi = useBilingual();

  if (!svc) return <NotFound />;

  const related = services.filter((s) => s.id !== svc.id && s.category === svc.category).slice(0, 3);
  const sectorObjs = sectors.filter((s) => svc.sectors.includes(s.id));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: bi(svc.name),
      description: bi(svc.overview),
      provider: { "@type": "Organization", name: "DSCC Saudi Arabia" },
      areaServed: "Saudi Arabia",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: svc.faqs.map((f) => ({ "@type": "Question", name: bi(f.q), acceptedAnswer: { "@type": "Answer", text: bi(f.a) } })),
    },
  ];

  return (
    <>
      <Seo title={bi(svc.name)} description={bi(svc.tagline)} path={`/services/${svc.slug}`} jsonLd={jsonLd} />

      <section className="bg-primary text-primary-foreground">
        <div className="container py-20">
          <div className="text-xs uppercase tracking-[0.18em] text-secondary mb-3">{svc.category}</div>
          <h1 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight max-w-3xl">{bi(svc.name)}</h1>
          <p className="mt-5 text-lg text-primary-foreground/80 max-w-2xl">{bi(svc.tagline)}</p>
        </div>
      </section>

      <section className="container py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-secondary mb-3">{t("common.summary")}</p>
            <p className="text-lg text-foreground/85 leading-relaxed">{bi(svc.overview)}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-secondary mb-4">{t("common.key_features")}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {svc.features.map((f, i) => (
                <li key={i} className="flex gap-3 items-start"><CheckCircle2 className="size-5 text-secondary shrink-0 mt-0.5" /><span className="text-sm text-foreground/85">{bi(f)}</span></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-secondary mb-4">{t("common.use_cases")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {svc.useCases.map((u, i) => (
                <div key={i} className="rounded-lg border bg-card p-4 text-sm text-foreground/85">{bi(u)}</div>
              ))}
            </div>
          </div>

          {svc.faqs.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-secondary mb-4">{t("common.faqs")}</p>
              <Accordion type="single" collapsible>
                {svc.faqs.map((f, i) => (
                  <AccordionItem key={i} value={`f${i}`}>
                    <AccordionTrigger className="text-left">{bi(f.q)}</AccordionTrigger>
                    <AccordionContent className="text-foreground/80 leading-relaxed">{bi(f.a)}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-secondary mb-3">{t("common.sectors_served")}</p>
              <ul className="space-y-2">
                {sectorObjs.map((s) => (
                  <li key={s.id}><Link href={`/sectors/${s.slug}`} className="text-sm text-foreground hover:text-primary">{bi(s.name)} →</Link></li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-secondary mb-3">{t("common.request_quote")}</p>
              <p className="text-sm text-primary-foreground/80 mb-5">Tell us about your project and a specialist will respond within one business day.</p>
              <Link href={`/quote?services=${svc.slug}`}><Button variant="secondary" className="w-full gap-2">{t("nav.quote")} <ArrowRight className="size-4" /></Button></Link>
            </CardContent>
          </Card>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="bg-muted/40 border-t">
          <div className="container py-16">
            <p className="text-xs uppercase tracking-[0.16em] text-secondary mb-4">{t("common.related_services")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link key={r.id} href={`/services/${r.slug}`}>
                  <Card className="hover:border-secondary transition group cursor-pointer">
                    <CardContent className="p-6">
                      <h3 className="font-serif text-lg text-foreground mb-2 group-hover:text-primary">{bi(r.name)}</h3>
                      <p className="text-sm text-muted-foreground">{bi(r.tagline)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
