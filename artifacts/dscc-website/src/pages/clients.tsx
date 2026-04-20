import { useLanguage } from "@/i18n/LanguageProvider";
import { Seo } from "@/components/seo/Seo";
import { clients } from "@/data/clients";

function LogoMark({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="aspect-[3/2] rounded-lg border bg-card flex flex-col items-center justify-center p-4 hover:border-secondary transition">
      <div className="font-serif text-3xl text-primary/80 mb-2">{initials}</div>
      <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground text-center">{name}</div>
    </div>
  );
}

export default function Clients() {
  const { t } = useLanguage();
  const our = clients.filter((c) => c.type === "client");
  const partners = clients.filter((c) => c.type === "partner");

  return (
    <>
      <Seo title={t("clients_page.title")} description={t("clients_page.subtitle")} path="/clients" />
      <section className="bg-primary text-primary-foreground">
        <div className="container py-20">
          <h1 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight">{t("clients_page.title")}</h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-foreground/80">{t("clients_page.subtitle")}</p>
        </div>
      </section>

      <section className="container py-16">
        <p className="text-xs uppercase tracking-[0.18em] text-secondary mb-6">{t("clients_page.our_clients")}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {our.map((c) => <LogoMark key={c.id} name={c.name} />)}
        </div>
      </section>

      <section className="container pb-20">
        <p className="text-xs uppercase tracking-[0.18em] text-secondary mb-6">{t("clients_page.our_partners")}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {partners.map((c) => <LogoMark key={c.id} name={c.name} />)}
        </div>
      </section>
    </>
  );
}
