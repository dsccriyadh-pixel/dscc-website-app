import { useLanguage } from "@/i18n/LanguageProvider";
import { Seo } from "@/components/seo/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { clients, type Client } from "@/data/clients";

function LogoCard({ c }: { c: Client }) {
  const baseUrl = import.meta.env.BASE_URL;
  return (
    <div className="aspect-[3/2] rounded-lg border bg-card flex flex-col items-center justify-center p-6 hover:border-primary transition">
      <img
        src={`${baseUrl.replace(/\/$/, "")}${c.logo}`}
        alt={c.name ?? "Logo"}
        className="max-h-16 max-w-full object-contain mb-2"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
      />
      {c.name && (
        <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground text-center">{c.name}</div>
      )}
    </div>
  );
}

export default function Clients() {
  const { t, lang } = useLanguage();
  const our = clients.filter((c) => c.type === "client");
  const partners = clients.filter((c) => c.type === "partner");

  return (
    <>
      <Seo title={t("clients_page.title")} description={t("clients_page.subtitle")} path="/clients" />
      <PageHero
        eyebrow={lang === "ar" ? "عملاؤنا" : "Our Clients"}
        title={t("clients_page.title")}
        subtitle={t("clients_page.subtitle")}
        image="/assets/uploads/media-uploader/hilton-swiss-palms1694250386.jpg"
      />

      <section className="container py-16">
        <p className="text-xs uppercase tracking-[0.18em] text-primary mb-6">{t("clients_page.our_clients")}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {our.map((c) => <LogoCard key={c.id} c={c} />)}
        </div>
      </section>

      <section className="container pb-20">
        <p className="text-xs uppercase tracking-[0.18em] text-primary mb-6">{t("clients_page.our_partners")}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {partners.map((c) => <LogoCard key={c.id} c={c} />)}
        </div>
      </section>
    </>
  );
}
