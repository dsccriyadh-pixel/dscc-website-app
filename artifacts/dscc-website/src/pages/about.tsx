import { useLanguage } from "@/i18n/LanguageProvider";
import { Seo } from "@/components/seo/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function About() {
  const { t } = useLanguage();
  const baseUrl = import.meta.env.BASE_URL;

  const values = [0, 1, 2, 3].map((i) => ({
    title: t(`about.values.${i}.title`),
    desc: t(`about.values.${i}.desc`),
  }));

  const leaders = [
    { name: "Khalid Al-Fahad", role: "Chief Executive Officer" },
    { name: "Sara Al-Mutairi", role: "Chief Operations Officer" },
    { name: "Yousef Al-Otaibi", role: "Head of Engineering (MEP)" },
    { name: "Reem Al-Saud", role: "Head of Hospitality Studio" },
    { name: "Faisal Bawazir", role: "Head of Procurement" },
    { name: "Layla Al-Harbi", role: "Head of Smart Systems" },
  ];

  return (
    <>
      <Seo title={t("about.title")} description={t("about.intro")} path="/about" />
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={`${baseUrl}img/hq-exterior.png`} alt="" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/30" />
        </div>
        <div className="container py-28 text-primary-foreground">
          <h1 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight max-w-3xl">{t("about.title")}</h1>
          <p className="mt-6 max-w-2xl text-lg text-primary-foreground/85 leading-relaxed">{t("about.intro")}</p>
        </div>
      </section>

      <section className="container py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-secondary mb-3">{t("about.mission_title")}</p>
          <h2 className="font-serif text-3xl text-foreground leading-tight">{t("about.mission")}</h2>
        </div>
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.18em] text-secondary">{t("about.values_title")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((v) => (
              <div key={v.title} className="flex gap-3">
                <CheckCircle2 className="size-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground mb-1">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 border-y">
        <div className="container py-20">
          <div className="max-w-2xl mb-12">
            <h2 className="font-serif text-3xl md:text-4xl mb-3">{t("about.leadership_title")}</h2>
            <p className="text-muted-foreground">{t("about.leadership_sub")}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {leaders.map((l) => (
              <Card key={l.name}>
                <CardContent className="p-6">
                  <div className="aspect-square mb-4 rounded-md bg-gradient-to-br from-primary/20 via-secondary/30 to-muted flex items-center justify-center">
                    <span className="font-serif text-3xl text-primary">{l.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <h3 className="font-medium text-foreground">{l.name}</h3>
                  <p className="text-sm text-muted-foreground">{l.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-secondary mb-3">{t("about.certifications_title")}</p>
        <p className="font-serif text-2xl text-foreground max-w-3xl mx-auto leading-relaxed">{t("about.certifications")}</p>
      </section>
    </>
  );
}
