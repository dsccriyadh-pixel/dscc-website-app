import { Link } from "wouter";
import { Seo } from "@/components/seo/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useBilingual, useLanguage } from "@/i18n/LanguageProvider";
import type { BilingualString } from "@/data/services";

const STATS: { v: string; k: BilingualString }[] = [
  { v: "3250", k: { en: "Total Projects",       ar: "إجمالي المشاريع" } },
  { v: "425",  k: { en: "Visionary Architects", ar: "معماريّون مبدعون" } },
  { v: "38",   k: { en: "Company locations",    ar: "مواقع الشركة" } },
  { v: "7430", k: { en: "Salified Clients",     ar: "عملاء راضون" } },
];

const ABOUT_PARAGRAPHS: BilingualString[] = [
  {
    en: "Welcome to DSCC Innovative One Stop Fit Out Solutions, where we believe that One Stop Fit Out Solutions is not just about structures; it's about creating inspiring spaces that push the boundaries of design, function, and innovation.",
    ar: "شركة DSCC متخصصة في تقديم حلول متكاملة للتشطيبات والتجهيزات والأنظمة الفنية للمشاريع السكنية والتجارية ومشاريع الضيافة والبنية التحتية.",
  },
  {
    en: "With a passion for reimagining the built environment, we are committed to crafting architectural solutions that captivate, inspire, and transform.",
    ar: "نعمل بمنهجية تجمع بين الاستشارة والتصميم والتوريد والتنفيذ، لنقدّم نتائج عالية الجودة بكفاءة وموثوقية.",
  },
  {
    en: "From conceptualization to realization, every project is a testament to our dedication to pushing the boundaries of architectural imagination.",
    ar: "نؤمن بأن نجاح المشروع يبدأ من فهم دقيق للاحتياج، لذلك نطوّر حلولاً عملية ومدروسة تضيف قيمة حقيقية وتحقق نتائج مستدامة.",
  },
];

const T = {
  hero:        { en: "WHO WE ARE", ar: "من نحن" },
  heroSub:     { en: "DSCC .. creativity, Functionality and architectural excellence",
                 ar: "حلول متكاملة للتشطيبات والتجهيزات والأنظمة الفنية." },
  joinUs:      { en: "Join Us on this Journey",   ar: "ابدأ مشروعك الآن" },
  joinUsSub:   { en: "Connect with us today to explore how DSCC Innovative One Stop Fit Out Solutions can transform your vision into reality.",
                 ar: "تواصل معنا اليوم لنحوّل رؤيتك إلى واقع." },
  contactNow:  { en: "Lets Contact Now",          ar: "تواصل معنا" },
  whatsapp:    { en: "What's App chat",           ar: "واتساب" },
};

export default function About() {
  const baseUrl = import.meta.env.BASE_URL;
  const bi = useBilingual();
  const { lang } = useLanguage();

  return (
    <>
      <Seo
        title={lang === "ar" ? `${bi(T.hero)} — DSCC` : `WHO WE ARE — DSCC`}
        description={bi(T.heroSub)}
        path="/about"
      />

      {/* HERO */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-24">
          <h1 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight max-w-3xl">{bi(T.hero)}</h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-foreground/85">{bi(T.heroSub)}</p>
        </div>
      </section>

      {/* MESSAGE — 3 paragraphs */}
      <section className="container py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <img
          src={`${baseUrl.replace(/\/$/, "")}/assets/images/about/who_dscc.jpg`}
          alt="DSCC business"
          className="rounded-lg w-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
        <div className="space-y-5">
          {ABOUT_PARAGRAPHS.map((p, i) => (
            <p key={i} className="text-lg text-foreground/85 leading-relaxed">{bi(p)}</p>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.k.en}>
                <div className="font-serif text-5xl mb-1">{s.v}</div>
                <div className="text-xs uppercase tracking-[0.16em] text-primary-foreground/80">{bi(s.k)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN US */}
      <section className="container py-20 text-center">
        <h2 className="font-serif text-3xl md:text-4xl mb-3">{bi(T.joinUs)}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">{bi(T.joinUsSub)}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/contact">
            <Button size="lg" className="gap-2">
              {bi(T.contactNow)} <ArrowRight className="size-4" />
            </Button>
          </Link>
          <a href="https://api.whatsapp.com/send?phone=966559846519&text=I%27m%20looking%20for%20Solution%20Provider%20(DSCC-WebSite)" target="_blank" rel="noreferrer">
            <Button size="lg" variant="outline" className="gap-2">
              <MessageCircle className="size-4" /> {bi(T.whatsapp)}
            </Button>
          </a>
        </div>
      </section>
    </>
  );
}
