import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Search } from "lucide-react";
import { useLanguage, useBilingual } from "@/i18n/LanguageProvider";
import { Seo } from "@/components/seo/Seo";
import { projects } from "@/data/projects";
import { projectShortDesc } from "@/data/extras";
import { sectors } from "@/data/sectors";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Projects() {
  const { t, lang } = useLanguage();
  const bi = useBilingual();
  const [q, setQ] = useState("");
  const [sec, setSec] = useState("all");
  const baseUrl = import.meta.env.BASE_URL;

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSec = sec === "all" || p.sectorId === sec;
      const text = `${bi(p.title)} ${bi(p.location)} ${bi(p.summary)}`.toLowerCase();
      const matchQ = !q || text.includes(q.toLowerCase());
      return matchSec && matchQ;
    });
  }, [q, sec, lang]);

  return (
    <>
      <Seo title={t("projects_page.title")} description={t("projects_page.subtitle")} path="/projects" />
      <section className="bg-primary text-primary-foreground">
        <div className="container py-20">
          <h1 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight">{t("projects_page.title")}</h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-foreground/80">{t("projects_page.subtitle")}</p>
        </div>
      </section>

      <section className="container py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("common.search")} className="pl-9" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant={sec === "all" ? "default" : "outline"} className="cursor-pointer" onClick={() => setSec("all")}>{t("common.all")}</Badge>
            {sectors.map((s) => (
              <Badge key={s.id} variant={sec === s.id ? "default" : "outline"} className="cursor-pointer" onClick={() => setSec(s.id)}>{bi(s.name)}</Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <Link key={p.id} href={`/projects/${p.slug}`}>
              <Card className="group overflow-hidden h-full hover:border-secondary transition cursor-pointer">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={`${baseUrl}${p.image}`} alt={bi(p.title)} className="size-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <CardContent className="p-5">
                  <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-1.5">{bi(p.location)} • {p.year}</div>
                  <h3 className="font-serif text-lg text-foreground mb-1 group-hover:text-primary">{bi(p.title)}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{bi(p.summary)}</p>
                  {projectShortDesc[p.slug] && (
                    <p className="text-xs text-foreground/70 mt-2 border-t pt-2 leading-relaxed">{bi(projectShortDesc[p.slug])}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
