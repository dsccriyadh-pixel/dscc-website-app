import { Link, useRoute } from "wouter";
import { useLanguage, useBilingual } from "@/i18n/LanguageProvider";
import { Seo } from "@/components/seo/Seo";
import { getResourceBySlug } from "@/data/resources";
import { services } from "@/data/services";
import NotFound from "./not-found";

export default function ResourceDetail() {
  const [, params] = useRoute("/resources/:slug");
  const slug = params?.slug ?? "";
  const r = getResourceBySlug(slug);
  const { t } = useLanguage();
  const bi = useBilingual();
  const baseUrl = import.meta.env.BASE_URL;

  if (!r) return <NotFound />;

  const related = services.filter((s) => r.relatedServices.includes(s.slug));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: bi(r.title),
    description: bi(r.excerpt),
    datePublished: r.date,
    author: { "@type": "Organization", name: bi(r.author) },
    publisher: { "@type": "Organization", name: "DSCC Saudi Arabia" },
  };

  return (
    <>
      <Seo title={bi(r.title)} description={bi(r.excerpt)} path={`/resources/${r.slug}`} type="article" jsonLd={jsonLd} />

      <article>
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img src={`${baseUrl}${r.image}`} alt="" className="size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/70 to-primary/40" />
          </div>
          <div className="container py-24 text-primary-foreground">
            <div className="text-xs uppercase tracking-[0.18em] text-secondary mb-3">{bi(r.category)} • {r.date}</div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight max-w-3xl">{bi(r.title)}</h1>
            <p className="mt-4 text-primary-foreground/80">{bi(r.author)}</p>
          </div>
        </section>

        <div className="container py-16 max-w-3xl">
          <p className="text-lg text-foreground/85 mb-8 italic">{bi(r.excerpt)}</p>
          <div className="prose prose-lg max-w-none text-foreground/85 whitespace-pre-line leading-relaxed">{bi(r.body)}</div>
        </div>

        {related.length > 0 && (
          <section className="bg-muted/40 border-t">
            <div className="container py-12 max-w-3xl">
              <p className="text-xs uppercase tracking-[0.16em] text-secondary mb-4">{t("common.related_services")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((s) => (
                  <Link key={s.id} href={`/services/${s.slug}`} className="border rounded-lg p-4 bg-card hover:border-secondary transition">
                    <div className="text-xs text-secondary mb-1">{s.category}</div>
                    <div className="text-sm font-medium text-foreground">{bi(s.name)}</div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}
