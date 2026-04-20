import { Link } from "wouter";
import { Seo } from "@/components/seo/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useBilingual, useLanguage } from "@/i18n/LanguageProvider";
import type { BilingualString } from "@/data/services";

const TEAMS: BilingualString[] = [
  { en: "Architecture Team",       ar: "فريق العمارة" },
  { en: "Interior Design Team",    ar: "فريق التصميم الداخلي" },
  { en: "Engineering Team",        ar: "فريق الهندسة" },
  { en: "Project Management Team", ar: "فريق إدارة المشاريع" },
  { en: "Execution Team",          ar: "فريق التنفيذ" },
];

const STATS: { v: string; k: BilingualString }[] = [
  { v: "3250", k: { en: "Total Projects",       ar: "إجمالي المشاريع" } },
  { v: "425",  k: { en: "Visionary Architects", ar: "معماريّون مبدعون" } },
  { v: "38",   k: { en: "Company locations",    ar: "مواقع الشركة" } },
  { v: "7430", k: { en: "Salified Clients",     ar: "عملاء راضون" } },
];

const LOGO_PHILOSOPHY: BilingualString[] = [
  {
    en: "the base is the earth soil, for this it should be the black color, this layer is our company land foundation and our believe seeds were planted into: contacting for empower values, more values we can add to our clients and empower them, our soil will become more rich to grow the seeds into tree the into forest",
    ar: "القاعدة هي تربة الأرض، ولذلك يجب أن تكون باللون الأسود؛ هذه الطبقة هي أساس أرض شركتنا التي زُرعت فيها بذور إيماننا: التعاقد لتمكين القيم — كلّما أضفنا قيمةً أكبر لعملائنا ومكّنّاهم، أصبحت تربتنا أغنى لتُنبت بذورنا شجرةً ثمّ غابة.",
  },
  {
    en: "second layer DSCC is in green color because we consider our company as one of the tree in the forest, if we are able to survive and live healthy, we must grow toward to the bright sunlight, means we must engage a bright legal business under the sunshine, we must absorb the positive energy and continue absorb nutritious from our land to grow bigger and bigger and become a prosperous forest in the end and contribute for the society",
    ar: "الطبقة الثانية، اسم DSCC باللون الأخضر، لأنّنا نعتبر شركتنا شجرةً من أشجار الغابة؛ ولكي نبقى ونعيش بصحّة، علينا أن ننمو نحو نور الشمس — أي أن نمارس عملاً نظيفاً وقانونياً تحت ضوء النهار، نمتصّ الطاقة الإيجابية ونستمدّ الغذاء من أرضنا لنكبر أكثر فأكثر ونصبح غابةً مزدهرة تُسهم في خدمة المجتمع.",
  },
  {
    en: "the third layer is sunshine symbol , means bright business, positive energy, blossom future, it is made of many files and books, means we must have system work flow and always learn more, u can also consider it as stairs, we believe continuous grow and move forward practical walk steps by steps, different color means different stages, continuous land touch efforts will accumulate our power to reach our targets",
    ar: "الطبقة الثالثة هي رمز الشمس، وتعني عملاً مشرقاً وطاقةً إيجابيّةً ومستقبلاً مُزهراً؛ مكوّنة من ملفّات وكتب تعني وجوب توفّر منظومة عمل والتعلّم الدائم. ويمكن اعتبارها كذلك سلّماً نؤمن بأنّ النموّ المستمرّ والتقدّم خطوةً خطوةً، باختلاف الألوان للمراحل المختلفة، سيراكم قوّتنا للوصول إلى أهدافنا.",
  },
];

const T = {
  hero:        { en: "WHO WE ARE",                                                  ar: "من نحن" },
  heroSub:     { en: "DSCC .. creativity, Functionality and architectural excellence",
                 ar: "DSCC .. الإبداع، الوظيفة، والتميّز المعماري" },
  ourMessage:  { en: "OUR MESSAGE",                                                 ar: "رسالتنا" },
  msgHeading:  { en: "DSCC .. creativity, Functionality and architectural excellence",
                 ar: "DSCC .. الإبداع والوظيفة والتميّز المعماري" },
  msgBody:     { en: "Welcome to DSCC Innovative One Stop Fit Out Solutions, where we believe that One Stop Fit Out Solutions is not just about structures; it's about creating inspiring spaces that push the boundaries of design, function, and innovation. With a passion for reimagining the built environment, we are committed to crafting architectural solutions that captivate, inspire, and transform.",
                 ar: "أهلاً بكم في DSCC لحلول التجهيز المتكاملة المبتكرة. نؤمن أنّ التجهيز المتكامل ليس مجرّد إنشاء هياكل، بل خلق مساحات مُلهِمة تتجاوز حدود التصميم والوظيفة والابتكار. بشغفنا لإعادة تصوّر البيئة المبنيّة، نلتزم بصياغة حلول معمارية تأسر العين وتُلهم وتُحدث التحوّل." },
  ourTeams:    { en: "OUR TEAMS",                                                   ar: "فِرَقُنا" },
  teamsTitle:  { en: "DSCC Specialized Teams",                                      ar: "فِرَق DSCC المتخصّصة" },
  ourLogo:     { en: "OUR LOGO",                                                    ar: "شعارنا" },
  brandTitle:  { en: "Brand to reflect our Message",                                ar: "هويّة تعكس رسالتنا" },
  brandIntro:  { en: "DSCC logo is reflection of our company philosophy and what we believe, who we are, what we bring values for the society :",
                 ar: "شعار DSCC انعكاس لفلسفة شركتنا، ولِما نؤمن به، ولهويّتنا، وللقيم التي نُقدّمها للمجتمع:" },
  ourMission:  { en: "OUR MISSION",                                                 ar: "مهمّتنا" },
  missionH:    { en: "to redefine the possibilities of One Stop Fit Out Solutions through innovation and creativity",
                 ar: "إعادة تعريف إمكانات حلول التجهيز المتكامل عبر الابتكار والإبداع" },
  missionBody: { en: "At DSCC, our mission is simple yet profound: to redefine the possibilities of One Stop fit out solution through innovation and creativity. We strive to challenge conventional norms and explore uncharted territories in architectural design, all while maintaining a deep respect for cultural heritage, sustainability, and the unique needs of each project.",
                 ar: "مهمّتنا في DSCC بسيطةٌ لكنّها عميقة: إعادة تعريف إمكانات التجهيز المتكامل عبر الابتكار والإبداع. نسعى لتحدّي المألوف واستكشاف آفاق غير مطروقة في التصميم المعماري، مع احترام عميق للموروث الثقافي والاستدامة واحتياجات كلّ مشروع الفريدة." },
  ourApproach: { en: "OUR APPROACH",                                                ar: "نهجنا" },
  approachH:   { en: "cutting-edge technologies, collaborative thinking",
                 ar: "تقنيات متطوّرة وتفكير تشاركي" },
  approachBody:{ en: "Our approach is rooted in the fusion of innovation and One Stop Fit Out Solutions. We leverage cutting-edge technologies, collaborative thinking, and a deep understanding of spatial dynamics to craft designs that are as functional as they are visually striking. From conceptualization to realization, every project is a testament to our dedication to pushing the boundaries of architectural imagination.",
                 ar: "يقوم نهجنا على المزج بين الابتكار وحلول التجهيز المتكامل. نوظّف أحدث التقنيات والتفكير التشاركي وفهماً عميقاً لديناميكيات الفضاء لصياغة تصاميم وظيفيّة بقدر ما هي مذهلة بصرياً. ومن التصوّر إلى التنفيذ، يُمثّل كلّ مشروع شاهداً على التزامنا بدفع حدود الخيال المعماري." },
  joinUs:      { en: "Join Us on this Journey",     ar: "انضمّ إلينا في هذه الرحلة" },
  joinUsSub:   { en: "Connect with us today to explore how DSCC Innovative One Stop Fit Out Solutions can transform your vision into reality.",
                 ar: "تواصل معنا اليوم لاستكشاف كيف يمكن لحلول DSCC المتكاملة المبتكرة أن تحوّل رؤيتك إلى واقع." },
  contactNow:  { en: "Lets Contact Now",            ar: "تواصل معنا الآن" },
  whatsapp:    { en: "What's App chat",             ar: "محادثة واتساب" },
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

      {/* OUR MESSAGE */}
      <section className="container py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <img
          src={`${baseUrl.replace(/\/$/, "")}/assets/images/about/who_dscc.jpg`}
          alt="DSCC business"
          className="rounded-lg w-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary mb-3">{bi(T.ourMessage)}</p>
          <h2 className="font-serif text-3xl text-foreground mb-5">{bi(T.msgHeading)}</h2>
          <p className="text-foreground/85 leading-relaxed">{bi(T.msgBody)}</p>
        </div>
      </section>

      {/* TEAMS */}
      <section className="bg-muted/30 border-y">
        <div className="container py-16">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">{bi(T.ourTeams)}</p>
            <h2 className="font-serif text-3xl text-foreground">{bi(T.teamsTitle)}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {TEAMS.map((tm) => (
              <Card key={tm.en}>
                <CardContent className="p-5 text-center">
                  <div className="font-serif text-base text-foreground">{bi(tm)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* LOGO */}
      <section className="container py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary mb-3">{bi(T.ourLogo)}</p>
          <h2 className="font-serif text-3xl text-foreground mb-5">{bi(T.brandTitle)}</h2>
          <p className="text-foreground/85 mb-6">{bi(T.brandIntro)}</p>
          <ul className="space-y-4">
            {LOGO_PHILOSOPHY.map((para, i) => (
              <li key={i} className="border-l-2 border-primary pl-4 text-sm text-foreground/80 leading-relaxed">
                {bi(para)}
              </li>
            ))}
          </ul>
        </div>
        <img
          src={`${baseUrl.replace(/\/$/, "")}/assets/images/about/brand.svg`}
          alt="DSCC Brand"
          className="w-full max-w-md mx-auto"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      </section>

      {/* MISSION + APPROACH */}
      <section className="bg-muted/30 border-y">
        <div className="container py-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <img
              src={`${baseUrl.replace(/\/$/, "")}/assets/images/about/mission.jpg`}
              alt="Our Mission"
              className="rounded-lg w-full object-cover mb-6"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">{bi(T.ourMission)}</p>
            <h3 className="font-serif text-2xl text-foreground mb-3">{bi(T.missionH)}</h3>
            <p className="text-foreground/80 leading-relaxed">{bi(T.missionBody)}</p>
          </div>
          <div>
            <img
              src={`${baseUrl.replace(/\/$/, "")}/assets/images/about/approch.jpg`}
              alt="Our Approach"
              className="rounded-lg w-full object-cover mb-6"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">{bi(T.ourApproach)}</p>
            <h3 className="font-serif text-2xl text-foreground mb-3">{bi(T.approachH)}</h3>
            <p className="text-foreground/80 leading-relaxed">{bi(T.approachBody)}</p>
          </div>
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
