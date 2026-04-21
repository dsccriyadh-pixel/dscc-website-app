import { Link } from "wouter";
import { useLanguage, useBilingual } from "@/i18n/LanguageProvider";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { resources } from "@/data/resources";
import { Card, CardContent } from "@/components/ui/card";

export default function Resources() {
  const { t, lang } = useLanguage();
  const bi = useBilingual();
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <>
      <Seo title={t("resources_page.title")} description={t("resources_page.subtitle")} path="/resources" />
      <PageHero
        eyebrow={lang === "ar" ? "مكتبة المعرفة" : "Knowledge Hub"}
        title={t("resources_page.title")}
        subtitle={t("resources_page.subtitle")}
        image="/assets/uploads/media-uploader/cover011693833991.jpg"
      />

      <section className="container py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((r) => (
          <Link key={r.id} href={`/resources/${r.slug}`}>
            <Card className="overflow-hidden h-full group hover:border-secondary transition cursor-pointer">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={`${baseUrl.replace(/\/$/, "")}${r.image}`} alt={bi(r.title)} className="size-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <CardContent className="p-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
                  <span>{bi(r.category)}</span><span>{r.date}</span>
                </div>
                <h3 className="font-serif text-lg text-foreground mb-2 group-hover:text-primary">{bi(r.title)}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{bi(r.excerpt)}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </>
  );
}
