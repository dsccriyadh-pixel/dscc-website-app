import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Search } from "lucide-react";
import { useLanguage, useBilingual } from "@/i18n/LanguageProvider";
import { Seo } from "@/components/seo/Seo";
import { services, serviceCategories } from "@/data/services";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Services() {
  const { t, lang } = useLanguage();
  const bi = useBilingual();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchCat = cat === "all" || s.category === cat;
      const text = `${bi(s.name)} ${bi(s.tagline)} ${bi(s.overview)}`.toLowerCase();
      const matchQ = !q || text.includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [q, cat, lang]);

  return (
    <>
      <Seo title={t("services_page.title")} description={t("services_page.subtitle")} path="/services" />
      <section className="bg-primary text-primary-foreground">
        <div className="container py-20">
          <h1 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight">{t("services_page.title")}</h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-foreground/80">{t("services_page.subtitle")}</p>
        </div>
      </section>

      <section className="container py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("common.search")} className="pl-9" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant={cat === "all" ? "default" : "outline"} className="cursor-pointer" onClick={() => setCat("all")}>{t("common.all")}</Badge>
            {serviceCategories.map((c) => (
              <Badge key={c.key} variant={cat === c.key ? "default" : "outline"} className="cursor-pointer" onClick={() => setCat(c.key)}>{bi(c.name)}</Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => {
            const baseUrl = import.meta.env.BASE_URL;
            return (
              <Link key={s.id} href={`/services/${s.slug}`}>
                <Card className="h-full hover:border-primary transition group cursor-pointer">
                  <CardContent className="p-6">
                    {s.icon && (
                      <img src={`${baseUrl.replace(/\/$/, "")}${s.icon}`} alt="" className="mb-4 h-12 w-12 object-contain" />
                    )}
                    <div className="text-xs uppercase tracking-[0.14em] text-primary mb-2">{s.category}</div>
                    <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-primary">{bi(s.name)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{bi(s.tagline)}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
