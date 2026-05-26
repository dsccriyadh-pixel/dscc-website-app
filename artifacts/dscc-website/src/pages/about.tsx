import { Link } from "wouter";
import { Seo } from "@/components/seo/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, ClipboardList, Map, Hammer, CheckCircle2, ShieldCheck, Users, Award, Layers } from "lucide-react";
import { useBilingual, useLanguage } from "@/i18n/LanguageProvider";
import { PageHero } from "@/components/layout/PageHero";
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
  // Added per UX brief — multidisciplinary expertise, integration, long-term commitment
  {
    en: "Our multidisciplinary expertise covers architecture, interior fit-out, MEP, smart systems and hospitality — all under a single accountable team.",
    ar: "خبرتنا المتعددة التخصصات تغطي العمارة والتشطيبات الداخلية والأنظمة الكهروميكانيكية والأنظمة الذكية والضيافة — تحت مظلة فريق واحد ومسؤول.",
  },
  {
    en: "We integrate design, supply and execution into one workflow, and stay committed to quality and long-term results well beyond handover.",
    ar: "نُكامل بين التصميم والتوريد والتنفيذ في مسار عمل واحد، ونلتزم بالجودة والنتائج طويلة الأمد إلى ما بعد التسليم بفترة طويلة.",
  },
];

const PHILOSOPHY: BilingualString = {
  en: "We start by deeply understanding the client's need, translate it into practical and executable solutions, and stay focused on quality and outcomes — not just outputs.",
  ar: "نبدأ بفهم عميق لاحتياج العميل، ثم نُترجمه إلى حلول عملية قابلة للتنفيذ، ونحافظ على التركيز على الجودة والنتائج — لا مجرّد المخرجات.",
};

const METHODOLOGY: { title: BilingualString; desc: BilingualString; icon: any }[] = [
  { title: { en: "Project Study",         ar: "دراسة المشروع" }, desc: { en: "Requirements analysis", ar: "تحليل المتطلبات" },                       icon: ClipboardList },
  { title: { en: "Planning",              ar: "التخطيط" },        desc: { en: "Setting a clear execution plan", ar: "وضع خطة تنفيذ واضحة" },          icon: Map },
  { title: { en: "Execution",             ar: "التنفيذ" },        desc: { en: "Applying solutions to standard", ar: "تطبيق الحلول وفق المعايير" },    icon: Hammer },
  { title: { en: "Handover",              ar: "التسليم" },        desc: { en: "Quality review and final handover", ar: "مراجعة الجودة والتسليم النهائي" }, icon: CheckCircle2 },
];

const EXPERTISE: BilingualString = {
  en: "We deliver across residential, commercial, hospitality and infrastructure projects, with multidisciplinary teams and the ability to manage projects of varying scale and complexity from start to finish.",
  ar: "ننفّذ مشاريع سكنية وتجارية وضيافة وبنية تحتية، عبر فرق متعددة التخصصات، ولدينا القدرة على إدارة المشاريع بمختلف أحجامها وتعقيداتها من البداية حتى النهاية.",
};

const TRUST: { title: BilingualString; icon: any }[] = [
  { title: { en: "Execution expertise", ar: "خبرة تنفيذية" }, icon: Award },
  { title: { en: "High quality",        ar: "جودة عالية" },   icon: ShieldCheck },
  { title: { en: "On-time delivery",    ar: "التزام بالمواعيد" }, icon: CheckCircle2 },
  { title: { en: "Integrated solutions",ar: "حلول متكاملة" }, icon: Layers },
];

const T = {
  hero:        { en: "WHO WE ARE", ar: "من نحن" },
  heroSub:     { en: "DSCC .. creativity, Functionality and architectural excellence",
                 ar: "حلول متكاملة للتشطيبات والتجهيزات والأنظمة الفنية." },
  philosophy:  { en: "Our Philosophy",       ar: "فلسفتنا" },
  methodology: { en: "How We Work",          ar: "منهجية العمل" },
  expertise:   { en: "Our Expertise",        ar: "خبراتنا" },
  trust:       { en: "Why Clients Trust Us", ar: "لماذا يثق بنا عملاؤنا" },
  joinUs:      { en: "Start Your Project With Us Today",   ar: "ابدأ مشروعك معنا اليوم" },
  joinUsSub:   { en: "Talk to our team for a tailored quotation.",
                 ar: "تواصل مع فريقنا للحصول على عرض سعر مخصص." },
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
      <PageHero
        eyebrow={lang === "ar" ? "من نحن" : "About Us"}
        title={bi(T.hero)}
        subtitle={bi(T.heroSub)}
        image="/assets/uploads/media-uploader/cover021693834064.jpg"
      />

      {/* MESSAGE — paragraphs */}
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

      {/* PHILOSOPHY */}
      <section className="bg-muted/30 border-y">
        <div className="container py-16 max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-primary mb-3">{bi(T.philosophy)}</p>
          <h2 className="font-serif text-3xl text-foreground mb-5">{bi(T.philosophy)}</h2>
          <p className="text-foreground/85 leading-relaxed text-lg">{bi(PHILOSOPHY)}</p>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="container py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">{bi(T.methodology)}</p>
          <h2 className="font-serif text-3xl text-foreground">{bi(T.methodology)}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {METHODOLOGY.map((m, i) => (
            <Card key={m.title.en}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <m.icon className="size-7 text-primary" />
                  <span className="font-serif text-2xl text-primary/30">0{i + 1}</span>
                </div>
                <h3 className="font-serif text-lg text-foreground mb-1">{bi(m.title)}</h3>
                <p className="text-sm text-muted-foreground">{bi(m.desc)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* EXPERTISE */}
      <section className="bg-muted/30 border-y">
        <div className="container py-16 max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-primary mb-3">{bi(T.expertise)}</p>
          <h2 className="font-serif text-3xl text-foreground mb-5">{bi(T.expertise)}</h2>
          <p className="text-foreground/85 leading-relaxed text-lg">{bi(EXPERTISE)}</p>
        </div>
      </section>

      {/* TRUST */}
      <section className="container py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">{bi(T.trust)}</p>
          <h2 className="font-serif text-3xl text-foreground">{bi(T.trust)}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {TRUST.map((t) => (
            <Card key={t.title.en}>
              <CardContent className="p-6 text-center">
                <t.icon className="size-8 text-primary mx-auto mb-3" />
                <div className="font-serif text-lg text-foreground">{bi(t.title)}</div>
              </CardContent>
            </Card>
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
          <a href="https://api.whatsapp.com/send?phone=966553117884&text=I%27m%20looking%20for%20Solution%20Provider%20(DSCC-WebSite)" target="_blank" rel="noreferrer">
            <Button size="lg" variant="outline" className="gap-2">
              <MessageCircle className="size-4" /> {bi(T.whatsapp)}
            </Button>
          </a>
        </div>
      </section>
    </>
  );
}
