import { Link, useRoute } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage, useBilingual } from "@/i18n/LanguageProvider";
import { Seo } from "@/components/seo/Seo";
import { getSectorBySlug } from "@/data/sectors";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import NotFound from "./not-found";

export default function SectorDetail() {
  const [, params] = useRoute("/sectors/:slug");
  const slug = params?.slug ?? "";
  const sec = getSectorBySlug(slug);
  const { t } = useLanguage();
  const bi = useBilingual();
  const baseUrl = import.meta.env.BASE_URL;

  if (!sec) return <NotFound />;

  const related = services.filter((s) => sec.serviceSlugs.includes(s.slug));
  const examples = projects.filter((p) => p.sectorId === sec.id).slice(0, 4);

  return (
    <>
      <Seo title={bi(sec.name)} description={bi(sec.tagline)} path={`/sectors/${sec.slug}`} />

      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={`${baseUrl.replace(/\/$/, "")}${sec.image}`} alt="" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        </div>
        <div className="container py-28 text-primary-foreground">
          <h1 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight max-w-3xl">{bi(sec.name)}</h1>
          <p className="mt-5 text-lg text-primary-foreground/85 max-w-2xl">{bi(sec.tagline)}</p>
        </div>
      </section>

      <section className="container py-16 max-w-4xl">
        <p className="text-lg text-foreground/85 leading-relaxed">{bi(sec.overview)}</p>
      </section>

      {(sec.needs.length > 0 || sec.process.length > 0) && (
        <section className="bg-muted/40 border-y">
          <div className="container py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
            {sec.needs.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-secondary mb-4">{t("common.client_needs")}</p>
                <ul className="space-y-3">
                  {sec.needs.map((n, i) => (
                    <li key={i} className="flex gap-3 items-start"><CheckCircle2 className="size-5 text-secondary shrink-0 mt-0.5" /><span className="text-foreground/85">{bi(n)}</span></li>
                  ))}
                </ul>
              </div>
            )}
            {sec.process.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-secondary mb-4">{t("common.our_process")}</p>
                <ol className="space-y-4">
                  {sec.process.map((p, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="font-serif text-2xl text-secondary leading-none">0{i + 1}</span>
                      <div>
                        <h4 className="font-medium text-foreground mb-1">{bi(p.title)}</h4>
                        <p className="text-sm text-muted-foreground">{bi(p.desc)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="container py-16">
        <p className="text-xs uppercase tracking-[0.16em] text-secondary mb-6">{t("common.related_services")}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {related.map((s) => (
            <Link key={s.id} href={`/services/${s.slug}`}>
              <div className="border rounded-lg p-4 bg-card hover:border-secondary hover:bg-muted/30 transition cursor-pointer">
                <div className="text-xs text-secondary mb-1">{s.category}</div>
                <div className="text-sm font-medium text-foreground">{bi(s.name)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {examples.length > 0 && (
        <section className="bg-muted/40 border-y">
          <div className="container py-16">
            <p className="text-xs uppercase tracking-[0.16em] text-secondary mb-6">{t("common.example_projects")}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {examples.map((p) => (
                <Link key={p.id} href={`/projects/${p.slug}`}>
                  <Card className="overflow-hidden group hover:border-secondary transition cursor-pointer">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={`${baseUrl.replace(/\/$/, "")}${p.image}`} alt={bi(p.title)} className="size-full object-cover transition duration-700 group-hover:scale-105" />
                    </div>
                    <CardContent className="p-5">
                      <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-1">{bi(p.location)} • {p.year}</div>
                      <h3 className="font-serif text-lg text-foreground group-hover:text-primary">{bi(p.title)}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {sec.faqs.length > 0 && (
        <section className="container py-16 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.16em] text-secondary mb-4">{t("common.faqs")}</p>
          <Accordion type="single" collapsible>
            {sec.faqs.map((f, i) => (
              <AccordionItem key={i} value={`f${i}`}>
                <AccordionTrigger className="text-left">{bi(f.q)}</AccordionTrigger>
                <AccordionContent className="text-foreground/80 leading-relaxed">{bi(f.a)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      <section className="bg-primary text-primary-foreground">
        <div className="container py-16 text-center">
          <h3 className="font-serif text-3xl mb-4">Ready to scope your {bi(sec.name).toLowerCase()} project?</h3>
          <Link href={`/quote?type=${sec.slug}`}><Button variant="secondary" size="lg" className="gap-2">{t("nav.quote")} <ArrowRight className="size-4" /></Button></Link>
        </div>
      </section>
    </>
  );
}
