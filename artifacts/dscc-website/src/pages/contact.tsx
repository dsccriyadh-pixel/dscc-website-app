import { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Seo } from "@/components/seo/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitLead } from "@/lib/leads";
import { PageHero } from "@/components/layout/PageHero";

const MAPS_LINK = "https://maps.app.goo.gl/hi8vD8A5agjrpmaT7";

type Office = {
  city: string;
  cityAr: string;
  address: string;
  addressAr: string;
  shortAddress?: string;
  phone: string;
  email: string;
  mapUrl?: string;
};

const offices: Office[] = [
  {
    city: "Saudi HQ Office",
    cityAr: "المقر الرئيسي — الرياض",
    address: "Building 7878, Eastern Ring Road (Extension), Al Manakh District, Riyadh 14314, Saudi Arabia",
    addressAr: "مبنى 7878، امتداد الدائري الشرقي الفرعي، حي المناخ، الرياض 14314، المملكة العربية السعودية",
    shortAddress: "RNCA7878",
    phone: "+966 55 311 7884",
    email: "contact@dsccsaudia.com",
    mapUrl: MAPS_LINK,
  },
  {
    city: "Shanghai Office",
    cityAr: "مكتب شنغهاي",
    address: "456 Park Avenue, Shanghai 54321, China",
    addressAr: "456 بارك أفينيو، شنغهاي 54321، الصين",
    phone: "+86 21 9876 5432",
    email: "contact@dsccsaudia.com",
  },
];

const WHATSAPP_LINK =
  "https://api.whatsapp.com/send?phone=966553117884&text=I%27m%20looking%20for%20Solution%20Provider%20(DSCC-WebSite)";

export default function Contact() {
  const { t, lang } = useLanguage();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const baseUrl = import.meta.env.BASE_URL;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    const res = await submitLead({ source: "contact", data, at: new Date().toISOString() });
    setSubmitting(false);
    if (res.ok) {
      setDone(true);
      form.reset();
    } else {
      setError(
        lang === "ar"
          ? "تعذّر إرسال رسالتك. يرجى المحاولة لاحقاً أو التواصل عبر واتساب."
          : "We couldn't send your message. Please try again or contact us via WhatsApp.",
      );
    }
  }

  return (
    <>
      <Seo title={t("contact_page.title")} description={t("contact_page.subtitle")} path="/contact" />
      <PageHero
        eyebrow={lang === "ar" ? "تواصل معنا" : "Get in Touch"}
        title={t("contact_page.title")}
        subtitle={t("contact_page.subtitle")}
        image="/assets/uploads/media-uploader/cover041693834210.jpg"
      />

      <section className="container py-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {offices.map((o) => (
          <Card key={o.city}>
            <CardContent className="p-6">
              <h3 className="font-serif text-2xl text-foreground mb-4">{lang === "ar" ? o.cityAr : o.city}</h3>
              <ul className="space-y-3 text-sm text-foreground/85">
                <li className="flex gap-2"><MapPin className="size-4 text-primary mt-0.5 shrink-0" /> <span>{lang === "ar" ? o.addressAr : o.address}</span></li>
                {o.shortAddress && (
                  <li className="flex gap-2"><MapPin className="size-4 text-primary mt-0.5 shrink-0" /> <span dir="ltr">{lang === "ar" ? "العنوان الوطني المختصر: " : "Short Address: "}{o.shortAddress}</span></li>
                )}
                <li className="flex gap-2"><Phone className="size-4 text-primary mt-0.5 shrink-0" /> <a href={`tel:${o.phone.replace(/\s/g, "")}`} dir="ltr">{o.phone}</a></li>
                <li className="flex gap-2"><Mail className="size-4 text-primary mt-0.5 shrink-0" /> <a href={`mailto:${o.email}`}>{o.email}</a></li>
                {o.mapUrl && (
                  <li className="flex gap-2"><MapPin className="size-4 text-primary mt-0.5 shrink-0" /> <a href={o.mapUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">{lang === "ar" ? "افتح في خرائط جوجل" : "Open in Google Maps"}</a></li>
                )}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="container pb-20 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <Card className="lg:col-span-3">
          <CardContent className="p-8">
            <h2 className="font-serif text-3xl mb-2">{t("contact_page.send_message")}</h2>
            <p className="text-sm text-muted-foreground mb-6">
              {t("contact_page.subtitle")}
            </p>
            {done ? (
              <div className="rounded-lg border bg-muted/40 p-6 text-foreground">{t("contact_page.thanks")}</div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input name="name" required placeholder={t("contact_page.name")} />
                  <Input name="company" placeholder={t("contact_page.company")} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input name="phone" required placeholder={t("contact_page.phone")} />
                  <Input name="email" type="email" required placeholder={t("contact_page.email")} />
                </div>
                <Textarea name="message" rows={6} required placeholder={t("contact_page.message")} />
                {error && (
                  <p className="text-sm text-destructive" role="alert">{error}</p>
                )}
                <Button type="submit" disabled={submitting} size="lg" className="w-full md:w-auto">
                  {submitting ? t("common.loading") : t("contact_page.send")}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-serif text-2xl mb-1">
            {t("common.send_via_whatsapp").includes("واتساب") ? "طرق التواصل السريعة" : "Quick Contact"}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {t("common.send_via_whatsapp").includes("واتساب")
              ? "اختر القناة الأنسب لك — نرد خلال ساعات العمل"
              : "Choose the channel that suits you best — we reply within business hours"}
          </p>
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="block">
            <Card className="hover:border-primary hover:shadow-md transition group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition">
                  <MessageCircle className="size-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-serif text-lg leading-tight">{t("common.send_via_whatsapp")}</div>
                  <div className="text-sm text-muted-foreground mt-0.5" dir="ltr">+966 55 311 7884</div>
                </div>
              </CardContent>
            </Card>
          </a>
          <a href="mailto:contact@dsccsaudia.com" className="block">
            <Card className="hover:border-primary hover:shadow-md transition group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition">
                  <Mail className="size-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-serif text-lg leading-tight">{t("common.email_us")}</div>
                  <div className="text-sm text-muted-foreground mt-0.5 truncate">contact@dsccsaudia.com</div>
                </div>
              </CardContent>
            </Card>
          </a>
          <a href="tel:+966553117884" className="block">
            <Card className="hover:border-primary hover:shadow-md transition group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition">
                  <Phone className="size-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-serif text-lg leading-tight" dir="ltr">+966 55 311 7884</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{lang === "ar" ? "الأحد – الخميس 8:00 – 18:00 بتوقيت السعودية" : "Sun–Thu 08:00–18:00 KSA"}</div>
                </div>
              </CardContent>
            </Card>
          </a>
        </div>
      </section>
    </>
  );
}
