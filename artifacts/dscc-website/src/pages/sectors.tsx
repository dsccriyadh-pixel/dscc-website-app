import { Link } from "wouter";
import { useLanguage, useBilingual } from "@/i18n/LanguageProvider";
import { PageHero } from "@/components/layout/PageHero";
import { Seo } from "@/components/seo/Seo";
import { sectors } from "@/data/sectors";
import { Card, CardContent } from "@/components/ui/card";

export default function Sectors() {
  const { t, lang } = useLanguage();
  const bi = useBilingual();
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <>
      <Seo title={t("sectors_page.title")} description={t("sectors_page.subtitle")} path="/sectors" />
      <PageHero
        eyebrow={lang === "ar" ? "قطاعاتنا" : "Sectors"}
        title={t("sectors_page.title")}
        subtitle={t("sectors_page.subtitle")}
        image="/assets/uploads/media-uploader/cover031693834151.jpg"
      />

      <section className="container py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {sectors.map((s) => (
          <Link key={s.id} href={`/sectors/${s.slug}`}>
            <Card className="group overflow-hidden hover:border-secondary transition cursor-pointer">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={`${baseUrl.replace(/\/$/, "")}${s.image}`}
                  alt={bi(s.name)}
                  className="size-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              <CardContent className="p-7">
                <h2 className="font-serif text-2xl text-foreground mb-2 group-hover:text-primary">{bi(s.name)}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{bi(s.overview)}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </>
  );
}
