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

const offices = [
  {
    city: "Saudi HQ Office",
    address: "123 King Abdulaziz St., Riyadh 12345, Saudi Arabia",
    poBox: "P.O. Box 6789 Riyadh 52145",
    phone: "+966 11 1234 5678",
    fax: "+966 11 1234 5678",
    email: "contact@dsccarchitecture.com",
  },
  {
    city: "Shanghai Office",
    address: "456 Park Avenue, Shanghai 54321, China",
    poBox: "P.O. Box 5321 Shanghai 21111",
    phone: "+86 21 9876 5432",
    fax: "+966 11 1234 5678",
    email: "contact@dsccarchitecture.com",
  },
];

const WHATSAPP_LINK =
  "https://api.whatsapp.com/send?phone=966559846519&text=I%27m%20looking%20for%20Solution%20Provider%20(DSCC-WebSite)";

export default function Contact() {
  const { t, lang } = useLanguage();
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const baseUrl = import.meta.env.BASE_URL;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    await submitLead({ source: "contact", data, at: new Date().toISOString() });
    setSubmitting(false);
    setDone(true);
    (e.currentTarget as HTMLFormElement).reset();
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
              <h3 className="font-serif text-2xl text-foreground mb-4">{o.city}</h3>
              <ul className="space-y-3 text-sm text-foreground/85">
                <li className="flex gap-2"><MapPin className="size-4 text-primary mt-0.5 shrink-0" /> {o.address}</li>
                <li className="flex gap-2"><MapPin className="size-4 text-primary mt-0.5 shrink-0" /> {o.poBox}</li>
                <li className="flex gap-2"><Phone className="size-4 text-primary mt-0.5 shrink-0" /> <a href={`tel:${o.phone.replace(/\s/g, "")}`}>{o.phone}</a></li>
                <li className="flex gap-2"><Phone className="size-4 text-primary mt-0.5 shrink-0" /> Fax: {o.fax}</li>
                <li className="flex gap-2"><Mail className="size-4 text-primary mt-0.5 shrink-0" /> <a href={`mailto:${o.email}`}>{o.email}</a></li>
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="container pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="font-serif text-3xl mb-4">{t("contact_page.send_message")}</h2>
          {done ? (
            <div className="rounded-lg border bg-card p-6 text-foreground">{t("contact_page.thanks")}</div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <Input name="name" required placeholder={t("contact_page.name")} />
              <Input name="company" placeholder={t("contact_page.company")} />
              <div className="grid grid-cols-2 gap-3">
                <Input name="phone" required placeholder={t("contact_page.phone")} />
                <Input name="email" type="email" required placeholder={t("contact_page.email")} />
              </div>
              <Textarea name="message" rows={5} required placeholder={t("contact_page.message")} />
              <Button type="submit" disabled={submitting}>{submitting ? t("common.loading") : t("contact_page.send")}</Button>
            </form>
          )}
        </div>

        <div className="space-y-4">
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
            <Card className="hover:border-primary transition">
              <CardContent className="p-6 flex items-center gap-4">
                <MessageCircle className="size-8 text-primary" />
                <div>
                  <div className="font-serif text-lg">{t("common.send_via_whatsapp")}</div>
                  <div className="text-sm text-muted-foreground">+966 55 984 6519</div>
                </div>
              </CardContent>
            </Card>
          </a>
          <a href="mailto:contact@dsccarchitecture.com">
            <Card className="hover:border-primary transition">
              <CardContent className="p-6 flex items-center gap-4">
                <Mail className="size-8 text-primary" />
                <div>
                  <div className="font-serif text-lg">{t("common.email_us")}</div>
                  <div className="text-sm text-muted-foreground">contact@dsccarchitecture.com</div>
                </div>
              </CardContent>
            </Card>
          </a>
          <a href="tel:+966111234578">
            <Card className="hover:border-primary transition">
              <CardContent className="p-6 flex items-center gap-4">
                <Phone className="size-8 text-primary" />
                <div>
                  <div className="font-serif text-lg">+966 11 1234 5678</div>
                  <div className="text-sm text-muted-foreground">Sun–Thu 08:00–18:00 KSA</div>
                </div>
              </CardContent>
            </Card>
          </a>
        </div>
      </section>
    </>
  );
}
