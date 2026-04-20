import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Download, ChevronRight, ClipboardList, Truck, Wrench, LifeBuoy, Award, Users, Sparkles, Leaf } from "lucide-react";
import { useLanguage, useBilingual } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Seo, ORG_JSONLD } from "@/components/seo/Seo";
import { sectors } from "@/data/sectors";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { clients } from "@/data/clients";
import { serviceShortDesc, projectShortDesc, valueSupporting } from "@/data/extras";
import { ShieldCheck, CheckCircle2, Layers } from "lucide-react";
import type { BilingualString } from "@/data/services";

// Order matches client-provided sequence: Residential → Commercial → Hospitality → Infrastructure
const HERO_SLIDES: { headline: BilingualString; sub: BilingualString; cta: BilingualString; href: string; image: string; }[] = [
  {
    headline: { en: "Your  Dream Home",            ar: "منزلك كما تحلم به" },
    sub:      { en: "Crafting every detail to create harmonious spaces that reflect your personality & lifestyle",
                ar: "نحوّل المساحات إلى بيئات متكاملة تجمع بين الجمال والراحة والعملية، مع عناية دقيقة بكل تفصيلة." },
    cta:      { en: "Rsidential Services",         ar: "الخدمات السكنية" },
    href: "/sectors/residential",
    image: "/assets/uploads/media-uploader/cover021693834064.jpg",
  },
  {
    headline: { en: "Your  Successful Business",   ar: "حلول احترافية لأعمالك" },
    sub:      { en: "Architectural solutions tailored to your unique needs, preferences and project requirements",
                ar: "نقدم حلولاً متكاملة للمشاريع التجارية تجمع بين الكفاءة والجودة وتدعم نمو أعمالك." },
    cta:      { en: "Business Solutions",          ar: "حلول الأعمال" },
    href: "/sectors/commercial",
    image: "/assets/uploads/media-uploader/cover031693834151.jpg",
  },
  {
    headline: { en: "Your  Hospitality Solutions", ar: "تجربة ضيافة متكاملة" },
    sub:      { en: "We create a seamless harmony that blends functionality, comfort and aesthetics",
                ar: "نصمم وننفذ حلول الضيافة بما يعزز تجربة الضيوف ويرفع مستوى التميز." },
    cta:      { en: "Hospitality Solutions",       ar: "حلول الضيافة" },
    href: "/sectors/hospitality",
    image: "/assets/uploads/media-uploader/cover041693834210.jpg",
  },
  {
    headline: { en: "Your  Smart Decision",        ar: "شريكك لتنفيذ المشاريع" },
    sub:      { en: "One-stop solution provider of consultancy, design, building supplies and equipment.",
                ar: "نقدّم حلولاً متكاملة تشمل التصميم والتوريد والتنفيذ والتجهيز من البداية حتى التشغيل." },
    cta:      { en: "Infrastructure Solutions",    ar: "حلول البنية التحتية" },
    href: "/sectors/infrastructure",
    image: "/assets/uploads/media-uploader/cover011693833991.jpg",
  },
];

const FIT_OUT_STEPS: { title: BilingualString; desc: BilingualString; icon: any }[] = [
  { title: { en: "Design",              ar: "التصميم" },
    desc:  { en: "We develop integrated visions aligned with project goals", ar: "نطوّر رؤية متكاملة تتوافق مع أهداف المشروع" },
    icon: ClipboardList },
  { title: { en: "Materials Supply",    ar: "التوريد" },
    desc:  { en: "Materials and equipment from trusted sources", ar: "مواد وتجهيزات من مصادر موثوقة" },
    icon: Truck },
  { title: { en: "Installation",        ar: "التنفيذ والتركيب" },
    desc:  { en: "Precision and quality to the highest standards", ar: "دقة وجودة وفق أعلى المعايير" },
    icon: Wrench },
  { title: { en: "After Sale Services", ar: "خدمات ما بعد البيع" },
    desc:  { en: "Support and maintenance to ensure continuity", ar: "دعم وصيانة لضمان الاستمرارية" },
    icon: LifeBuoy },
];

const VALUES: { key: keyof typeof valueSupporting; title: BilingualString; desc: BilingualString; icon: any }[] = [
  { key: "excellence",     title: { en: "Excellence",     ar: "التميّز" },
    desc:  { en: "High-quality designs that exceed expectations. Value creativity and attention to detail.",
             ar: "جودة عالية ومعايير دقيقة" },
    icon: Award },
  { key: "client",         title: { en: "Client-Focus",   ar: "التركيز على العميل" },
    desc:  { en: "Make clients' needs our priority for developing trusted relationships, and customized solutions.",
             ar: "حلول مخصصة لكل مشروع" },
    icon: Users },
  { key: "innovation",     title: { en: "Innovation",     ar: "الابتكار" },
    desc:  { en: "Value creativity, innovation, and keeping up with the latest technologies and design trends.",
             ar: "استخدام أحدث التقنيات" },
    icon: Sparkles },
  { key: "sustainability", title: { en: "Sustainability", ar: "الاستدامة" },
    desc:  { en: "We committed to design sustainable buildings & spaces that are environmentally responsible",
             ar: "حلول مسؤولة وطويلة الأمد" },
    icon: Leaf },
];

const TRUST_ITEMS: { title: BilingualString; icon: any }[] = [
  { title: { en: "Execution expertise",  ar: "خبرة تنفيذية" },     icon: Award },
  { title: { en: "High quality",         ar: "جودة عالية" },       icon: ShieldCheck },
  { title: { en: "On-time delivery",     ar: "التزام بالمواعيد" }, icon: CheckCircle2 },
  { title: { en: "Integrated solutions", ar: "حلول متكاملة" },     icon: Layers },
];

const STATS: { v: string; k: BilingualString }[] = [
  { v: "3250", k: { en: "Total Projects",        ar: "إجمالي المشاريع" } },
  { v: "425",  k: { en: "Visionary Architects",  ar: "معماريّون مبدعون" } },
  { v: "38",   k: { en: "Company locations",     ar: "مواقع الشركة" } },
  { v: "7430", k: { en: "Salified Clients",      ar: "عملاء راضون" } },
];

const T = {
  badge:        { en: "Innovative One Stop Fit Out Solutions", ar: "حلول متكاملة للتشطيبات والتجهيزات" },
  reqQuote:     { en: "REQUEST QUOTE",                          ar: "اطلب عرض سعر" },
  oneStop:      { en: "One-Stop Fit Out Solution",              ar: "حلول متكاملة للتشطيبات والتجهيزات" },
  oneStopSub:   { en: "We provide an integrated delivery model from concept to operation.",
                  ar: "نقدّم نموذج عمل متكامل يضمن تنفيذ المشروع بسلاسة وجودة عالية، من الفكرة وحتى التشغيل." },
  whyTitle:     { en: "Why DSCC?",                              ar: "لماذا DSCC؟" },
  whySub:       { en: "We provide complete architectural solutions, Guided by our core values",
                  ar: "نقدم حلولاً متكاملة ترتكز على الجودة والابتكار وفهم احتياجات العميل." },
  solutionsKik: { en: "OUR SOLUTIONS",                          ar: "حلولنا" },
  solutionsTitle: { en: "Wide Range Of Innovative Modern Services And Solutions To Fit Your Needs",
                    ar: "نقدّم باقة متكاملة من الخدمات التي تغطي مختلف احتياجات المشاريع، مع التركيز على الجودة والتكامل والموثوقية." },
  viewAll:      { en: "View All",                               ar: "عرض جميع المشاريع" },
  innovHeading: { en: "DSCC .. Innovative One Stop Fit Out Solutions",
                  ar: "حلول متكاملة للتشطيبات والتجهيزات" },
  latest:       { en: "Latest Projects",                        ar: "أحدث المشاريع" },
  featuredProj: { en: "Featured Projects",                      ar: "نماذج من مشاريعنا التي تعكس جودة التنفيذ." },
  ourClients:   { en: "Our Clients",                            ar: "نفخر بثقة عملائنا" },
  ourClientsSub:{ en: "Trusted by leading organisations.",      ar: "تشرفنا بالعمل مع جهات رائدة." },
  ourPartners:  { en: "Our Partners",                           ar: "شركاؤنا" },
  ourPartnersSub:{ en: "Expanding capabilities through strong partnerships.", ar: "نوسّع الإمكانيات من خلال شراكات قوية." },
  joinUs:       { en: "Join Us on this Journey",                ar: "ابدأ مشروعك الآن" },
  joinUsSub:    { en: "Connect with us today to explore how DSCC Innovative One Stop Fit Out Solutions can transform your vision into reality.",
                  ar: "تواصل معنا اليوم لنحوّل رؤيتك إلى واقع." },
  contactNow:   { en: "Lets Contact Now",                       ar: "تواصل معنا" },
  whatsapp:     { en: "What's App chat",                        ar: "واتساب" },
  downloadProf: { en: "Download Profile",                       ar: "تحميل الملف التعريفي" },
  talkSpec:     { en: "Talk to a Specialist",                   ar: "تحدث مع مختص" },
  trustTitle:   { en: "Why Clients Trust Us",                   ar: "لماذا يثق بنا عملاؤنا" },
  consultTitle: { en: "Request a Consultation",                 ar: "اطلب استشارة" },
  consultSub:   { en: "Let us help turn your idea into a fully delivered project.",
                  ar: "دعنا نساعدك في تحويل فكرتك إلى مشروع متكامل." },
};

export default function Home() {
  const bi = useBilingual();
  const { lang } = useLanguage();
  const baseUrl = import.meta.env.BASE_URL;

  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSlide((i) => (i + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(id);
  }, []);
  const cur = HERO_SLIDES[slide];

  const featured = services.slice(0, 8);
  const featuredProjects = projects.slice(0, 4);
  const clientLogos = clients.filter((c) => c.type === "client");
  const partnerLogos = clients.filter((c) => c.type === "partner");

  return (
    <>
      <Seo
        title={lang === "ar" ? "DSCC — حلول متكاملة للتشطيبات والتجهيزات" : "DSCC - Contracting For Empower Values"}
        description={bi(T.innovHeading)}
        path="/"
        jsonLd={[
          ORG_JSONLD,
          { "@context": "https://schema.org", "@type": "WebSite", name: "DSCC Saudi Arabia", url: typeof window !== "undefined" ? window.location.origin : "" },
        ]}
      />

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={cur.image}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1 }}
            className="absolute inset-0 -z-10"
          >
            <img src={`${baseUrl.replace(/\/$/, "")}${cur.image}`} alt="" className="size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="container py-32 lg:py-44 text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${slide}-${lang}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur px-3 py-1 text-xs uppercase tracking-[0.18em] mb-6">
                {bi(T.badge)}
              </p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight whitespace-pre-line drop-shadow-md">
                {bi(cur.headline)}
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/95 max-w-2xl leading-relaxed drop-shadow">
                {bi(cur.sub)}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/quote">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    {bi(T.reqQuote)}
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white/50 bg-white/10 text-white hover:bg-white/20 gap-2">
                    {bi(T.talkSpec)}
                  </Button>
                </Link>
                <a href={`${baseUrl}downloads/dscc-company-profile.pdf`} download>
                  <Button size="lg" variant="outline" className="border-white/50 bg-white/10 text-white hover:bg-white/20 gap-2">
                    <Download className="size-4" /> {bi(T.downloadProf)}
                  </Button>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === slide ? "w-10 bg-white" : "w-4 bg-white/40"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ONE-STOP */}
      <section className="border-b">
        <div className="container py-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">{bi(T.oneStop)}</h2>
            <p className="text-muted-foreground">{bi(T.oneStopSub)}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {FIT_OUT_STEPS.map((step, i) => (
              <div key={step.title.en} className="text-center">
                <div className="mx-auto mb-3 size-16 rounded-full bg-primary/5 border border-primary/15 flex items-center justify-center text-primary">
                  <step.icon className="size-7" />
                </div>
                <div className="font-medium text-foreground mb-1">{i + 1}. {bi(step.title)}</div>
                <div className="text-xs text-muted-foreground">{bi(step.desc)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="container py-20">
        <div className="max-w-2xl mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">{bi(T.whyTitle)}</h2>
          <p className="text-muted-foreground">{bi(T.whySub)}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v) => (
            <Card key={v.title.en}>
              <CardContent className="p-6">
                <v.icon className="size-7 text-primary mb-4" />
                <h3 className="font-serif text-xl text-foreground mb-2">{bi(v.title)}</h3>
                <p className="text-sm text-foreground/80 leading-relaxed mb-2">{bi(v.desc)}</p>
                <p className="text-xs text-muted-foreground leading-relaxed border-t pt-2">{bi(valueSupporting[v.key])}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* SOLUTIONS GRID */}
      <section className="bg-muted/30 border-y">
        <div className="container py-20">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">{bi(T.solutionsKik)}</p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">{bi(T.solutionsTitle)}</h2>
            </div>
            <Link href="/services"><Button variant="ghost" className="gap-1">{bi(T.viewAll)} <ArrowRight className="size-4" /></Button></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((s) => (
              <Link key={s.id} href={`/services/${s.slug}`}>
                <Card className="h-full hover:border-primary transition group cursor-pointer">
                  <CardContent className="p-5 text-center">
                    {s.icon && (
                      <img src={`${baseUrl.replace(/\/$/, "")}${s.icon}`} alt="" className="mx-auto mb-3 h-12 w-12 object-contain" />
                    )}
                    <div className="font-medium text-sm text-foreground group-hover:text-primary leading-snug mb-2">{bi(s.name)}</div>
                    {serviceShortDesc[s.slug] && (
                      <div className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{bi(serviceShortDesc[s.slug])}</div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTORS — clean images */}
      <section className="container py-20">
        <div className="max-w-2xl mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">{bi(T.innovHeading)}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {sectors.map((s) => (
            <Link key={s.id} href={`/sectors/${s.slug}`}>
              <Card className="group overflow-hidden h-full hover:border-primary transition cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={`${baseUrl.replace(/\/$/, "")}${s.image}`} alt={bi(s.name)} className="size-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <CardContent className="p-5">
                  <div className="font-serif text-xl text-foreground mb-1 group-hover:text-primary">{bi(s.name)}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{bi(s.tagline)}</div>
                </CardContent>
              </Card>
            </Link>
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

      {/* FEATURED PROJECTS */}
      <section className="container py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">{bi(T.latest)}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">{bi(T.featuredProj)}</h2>
          </div>
          <Link href="/projects"><Button variant="ghost" className="gap-1">{bi(T.viewAll)} <ArrowRight className="size-4" /></Button></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredProjects.map((p) => (
            <Link key={p.id} href={`/projects/${p.slug}`}>
              <Card className="group overflow-hidden hover:border-primary transition cursor-pointer">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={`${baseUrl.replace(/\/$/, "")}${p.image}`} alt={bi(p.title)} className="size-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
                    <span>{bi(p.location)}</span><span>{p.year}</span>
                  </div>
                  <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-primary">{bi(p.title)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{bi(p.summary)}</p>
                  {projectShortDesc[p.slug] && (
                    <p className="text-xs text-foreground/70 leading-relaxed mt-2 border-t pt-2">{bi(projectShortDesc[p.slug])}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-muted/30 border-y">
        <div className="container py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">{bi(T.trustTitle)}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {TRUST_ITEMS.map((t) => (
              <Card key={t.title.en}>
                <CardContent className="p-6 text-center">
                  <t.icon className="size-8 text-primary mx-auto mb-3" />
                  <div className="font-serif text-lg text-foreground">{bi(t.title)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Consultation block */}
      <section className="border-y">
        <div className="container py-14 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-2">{bi(T.consultTitle)}</h3>
            <p className="text-muted-foreground">{bi(T.consultSub)}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/quote"><Button size="lg">{bi(T.reqQuote)}</Button></Link>
            <Link href="/contact"><Button size="lg" variant="outline">{bi(T.talkSpec)}</Button></Link>
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="bg-muted/30 border-y">
        <div className="container py-16">
          <p className="text-center text-xs uppercase tracking-[0.18em] text-primary mb-2">{bi(T.ourClients)}</p>
          <p className="text-center text-sm text-muted-foreground mb-8">{bi(T.ourClientsSub)}</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 items-center">
            {clientLogos.map((c) => (
              <div key={c.id} className="flex items-center justify-center p-3 bg-card rounded-md border h-20">
                <img
                  src={`${baseUrl.replace(/\/$/, "")}${c.logo}`}
                  alt={c.name ?? "Client"}
                  className="max-h-12 max-w-full object-contain opacity-80 hover:opacity-100 transition"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="container py-16">
        <p className="text-center text-xs uppercase tracking-[0.18em] text-primary mb-2">{bi(T.ourPartners)}</p>
        <p className="text-center text-sm text-muted-foreground mb-8">{bi(T.ourPartnersSub)}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {partnerLogos.map((p) => (
            <div key={p.id} className="flex items-center justify-center p-4 bg-card rounded-md border h-24">
              <img
                src={`${baseUrl.replace(/\/$/, "")}${p.logo}`}
                alt={p.name ?? "Partner"}
                className="max-h-16 max-w-full object-contain opacity-80 hover:opacity-100 transition"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* JOIN US */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-20 text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-3">{bi(T.joinUs)}</h2>
          <p className="text-primary-foreground/85 max-w-2xl mx-auto mb-8">{bi(T.joinUsSub)}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2">
                {bi(T.contactNow)} <ChevronRight className="size-4" />
              </Button>
            </Link>
            <a href="https://api.whatsapp.com/send?phone=966559846519&text=I%27m%20looking%20for%20Solution%20Provider%20(DSCC-WebSite)" target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                {bi(T.whatsapp)}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
