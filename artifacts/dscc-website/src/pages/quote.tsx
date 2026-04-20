import { useEffect, useMemo, useState } from "react";
import { Link, useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Upload, X, Download, MessageCircle, Mail } from "lucide-react";
import { useLanguage, useBilingual } from "@/i18n/LanguageProvider";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sectors } from "@/data/sectors";
import { services } from "@/data/services";
import { cities } from "@/data/cities";
import { submitLead, buildMailtoLink, buildWhatsAppLink, generateRef } from "@/lib/leads";

interface QuoteState {
  type: string;
  services: string[];
  city: string;
  area: string;
  stage: string;
  timeline: string;
  budget: string;
  scope: string[];
  files: string[];
  name: string;
  company: string;
  phone: string;
  email: string;
  notes: string;
}

const empty: QuoteState = {
  type: "", services: [], city: "", area: "", stage: "", timeline: "", budget: "",
  scope: [], files: [], name: "", company: "", phone: "+966 ", email: "", notes: "",
};

export default function Quote() {
  const { t } = useLanguage();
  const bi = useBilingual();
  const search = useSearch();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<QuoteState>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ ref: string } | null>(null);

  // prefill from URL
  useEffect(() => {
    const sp = new URLSearchParams(search);
    setState((s) => ({
      ...s,
      type: sp.get("type") || s.type,
      city: sp.get("city") || s.city,
      services: sp.get("services") ? sp.get("services")!.split(",") : s.services,
      budget: sp.get("budget") || s.budget,
      timeline: sp.get("timeline") || s.timeline,
    }));
  }, [search]);

  const update = <K extends keyof QuoteState>(k: K, v: QuoteState[K]) => setState((s) => ({ ...s, [k]: v }));
  const toggleArr = (k: "services" | "scope", v: string) =>
    setState((s) => {
      const has = s[k].includes(v);
      return { ...s, [k]: has ? s[k].filter((x) => x !== v) : [...s[k], v] };
    });

  const canNext = useMemo(() => {
    if (step === 1) return !!state.type;
    if (step === 2) return state.services.length > 0;
    if (step === 3) return state.city && state.area && state.stage && state.timeline && state.budget && state.scope.length > 0;
    if (step === 5) return state.name && state.phone && state.email;
    return true;
  }, [step, state]);

  async function onSubmit() {
    setSubmitting(true);
    const ref = generateRef();
    await submitLead({ source: "quote", data: state as unknown as Record<string, unknown>, ref, at: new Date().toISOString() });
    setSubmitting(false);
    setDone({ ref });
  }

  const summaryText = `DSCC Quotation Request\nType: ${state.type}\nServices: ${state.services.join(", ")}\nCity: ${state.city}\nSize: ${state.area}\nStage: ${state.stage}\nTimeline: ${state.timeline}\nBudget: ${state.budget}\nScope: ${state.scope.join(", ")}\nContact: ${state.name} / ${state.company} / ${state.phone} / ${state.email}\nNotes: ${state.notes}`;

  if (done) {
    return (
      <>
        <Seo title={t("quote.success_title")} description={t("quote.success_team")} path="/quote" />
        <section className="container py-24 max-w-2xl text-center">
          <CheckCircle2 className="size-16 text-secondary mx-auto mb-6" />
          <h1 className="font-serif text-4xl mb-4">{t("quote.success_title")}</h1>
          <p className="text-foreground/80 mb-2">{t("quote.success_body")} <span className="font-mono text-primary font-medium">{done.ref}</span></p>
          <p className="text-muted-foreground mb-10">{t("quote.success_team")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a href={buildWhatsAppLink(summaryText)} target="_blank" rel="noreferrer"><Button variant="outline" className="w-full gap-2"><MessageCircle className="size-4" />{t("quote.whatsapp")}</Button></a>
            <a href={buildMailtoLink(`DSCC Quote ${done.ref}`, summaryText)}><Button variant="outline" className="w-full gap-2"><Mail className="size-4" />{t("quote.email_proposal")}</Button></a>
            <a href={`${import.meta.env.BASE_URL}downloads/dscc-company-profile.pdf`} download><Button variant="outline" className="w-full gap-2"><Download className="size-4" />{t("common.download_profile")}</Button></a>
          </div>
          <Link href="/"><Button variant="ghost" className="mt-8">{t("quote.back_home")}</Button></Link>
        </section>
      </>
    );
  }

  const totalSteps = 6;
  const pct = (step / totalSteps) * 100;

  return (
    <>
      <Seo title={t("quote.title")} description={t("quote.subtitle")} path="/quote" />
      <section className="bg-primary text-primary-foreground">
        <div className="container py-16">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold">{t("quote.title")}</h1>
          <p className="mt-3 text-primary-foreground/80">{t("quote.subtitle")}</p>
        </div>
      </section>

      <section className="container py-12 max-w-3xl">
        <div className="mb-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>{t("quote.step")} {step} {t("quote.of")} {totalSteps}</span>
            <span>{Math.round(pct)}%</span>
          </div>
          <div className="h-1 rounded-full bg-muted overflow-hidden"><div className="h-full bg-secondary transition-all" style={{ width: `${pct}%` }} /></div>
        </div>

        <Card>
          <CardContent className="p-7">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                {step === 1 && (
                  <>
                    <h2 className="font-serif text-2xl mb-6">{t("quote.step_1_title")}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {sectors.map((s) => (
                        <button key={s.id} type="button" onClick={() => update("type", s.slug)} className={`text-left rounded-lg border p-5 transition ${state.type === s.slug ? "border-secondary bg-secondary/5" : "hover:border-secondary"}`}>
                          <div className="font-serif text-lg text-foreground">{bi(s.name)}</div>
                          <div className="text-sm text-muted-foreground mt-1">{bi(s.tagline)}</div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {step === 2 && (
                  <>
                    <h2 className="font-serif text-2xl mb-6">{t("quote.step_2_title")}</h2>
                    <div className="flex flex-wrap gap-2">
                      {services.map((s) => {
                        const a = state.services.includes(s.slug);
                        return <Badge key={s.slug} onClick={() => toggleArr("services", s.slug)} variant={a ? "default" : "outline"} className="cursor-pointer text-sm py-1.5 px-3">{bi(s.name)}</Badge>;
                      })}
                    </div>
                  </>
                )}
                {step === 3 && (
                  <>
                    <h2 className="font-serif text-2xl mb-6">{t("quote.step_3_title")}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{t("quote.field_city")}</label>
                        <Select value={state.city} onValueChange={(v) => update("city", v)}>
                          <SelectTrigger className="mt-1"><SelectValue placeholder={t("common.select")} /></SelectTrigger>
                          <SelectContent>{cities.map((c) => <SelectItem key={c.key} value={c.key}>{bi(c.name)}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{t("quote.field_area")}</label>
                        <Input className="mt-1" value={state.area} onChange={(e) => update("area", e.target.value)} placeholder={t("quote.field_area_placeholder")} />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{t("quote.field_stage")}</label>
                        <Select value={state.stage} onValueChange={(v) => update("stage", v)}>
                          <SelectTrigger className="mt-1"><SelectValue placeholder={t("common.select")} /></SelectTrigger>
                          <SelectContent>
                            {["concept", "schematic", "tender", "construction", "operating"].map((k) => <SelectItem key={k} value={k}>{t(`quote.stages.${k}`)}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{t("quote.field_timeline")}</label>
                        <Select value={state.timeline} onValueChange={(v) => update("timeline", v)}>
                          <SelectTrigger className="mt-1"><SelectValue placeholder={t("common.select")} /></SelectTrigger>
                          <SelectContent>
                            {["lt3", "3to6", "6to12", "gt12", "tbd"].map((k) => <SelectItem key={k} value={k}>{t(`quote.timelines.${k}`)}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{t("quote.field_budget")}</label>
                        <Select value={state.budget} onValueChange={(v) => update("budget", v)}>
                          <SelectTrigger className="mt-1"><SelectValue placeholder={t("common.select")} /></SelectTrigger>
                          <SelectContent>
                            {["lt500", "500to2m", "2to10m", "10to50m", "gt50m"].map((k) => <SelectItem key={k} value={k}>{t(`quote.budgets.${k}`)}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{t("quote.field_scope")}</label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {["design", "supply", "install", "turnkey"].map((k) => {
                            const a = state.scope.includes(k);
                            return <Badge key={k} onClick={() => toggleArr("scope", k)} variant={a ? "default" : "outline"} className="cursor-pointer text-sm py-1.5 px-3">{t(`quote.scopes.${k}`)}</Badge>;
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {step === 4 && (
                  <>
                    <h2 className="font-serif text-2xl mb-2">{t("quote.step_4_title")}</h2>
                    <p className="text-muted-foreground text-sm mb-6">{t("quote.step_4_sub")}</p>
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-8 cursor-pointer hover:border-secondary">
                      <Upload className="size-5 text-secondary" />
                      <span className="text-sm">{t("quote.attach_files")}</span>
                      <input type="file" multiple className="hidden" onChange={(e) => {
                        const names = Array.from(e.target.files ?? []).map((f) => f.name);
                        update("files", [...state.files, ...names]);
                        e.currentTarget.value = "";
                      }} />
                    </label>
                    {state.files.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {state.files.map((f, i) => (
                          <li key={i} className="flex items-center justify-between border rounded-md px-3 py-2 text-sm">
                            <span>{f}</span>
                            <button type="button" onClick={() => update("files", state.files.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive"><X className="size-4" /></button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="text-xs text-muted-foreground mt-3">{state.files.length} {t("quote.files_attached")}</p>
                  </>
                )}
                {step === 5 && (
                  <>
                    <h2 className="font-serif text-2xl mb-6">{t("quote.step_5_title")}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input value={state.name} onChange={(e) => update("name", e.target.value)} placeholder={t("quote.field_name")} required />
                      <Input value={state.company} onChange={(e) => update("company", e.target.value)} placeholder={t("quote.field_company")} />
                      <Input value={state.phone} onChange={(e) => update("phone", e.target.value)} placeholder={t("quote.field_phone")} required />
                      <Input value={state.email} onChange={(e) => update("email", e.target.value)} placeholder={t("quote.field_email")} type="email" required />
                      <Textarea className="sm:col-span-2" rows={3} value={state.notes} onChange={(e) => update("notes", e.target.value)} placeholder={t("quote.field_notes")} />
                    </div>
                  </>
                )}
                {step === 6 && (
                  <>
                    <h2 className="font-serif text-2xl mb-3">{t("quote.step_6_title")}</h2>
                    <p className="text-muted-foreground text-sm mb-6">{t("quote.review_intro")}</p>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {[
                        ["Type", state.type], ["City", state.city], ["Area", state.area],
                        ["Stage", state.stage], ["Timeline", state.timeline], ["Budget", state.budget],
                        ["Scope", state.scope.join(", ")], ["Services", state.services.join(", ")],
                        ["Name", state.name], ["Company", state.company], ["Phone", state.phone], ["Email", state.email],
                      ].map(([k, v]) => (
                        <div key={k} className="border-b pb-2">
                          <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{k}</dt>
                          <dd className="text-foreground mt-1">{v || "—"}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-10 pt-6 border-t">
              <Button variant="ghost" disabled={step === 1} onClick={() => setStep(step - 1)} className="gap-1"><ArrowLeft className="size-4" />{t("common.back")}</Button>
              {step < totalSteps ? (
                <Button onClick={() => canNext && setStep(step + 1)} disabled={!canNext} className="gap-1">{t("common.next")}<ArrowRight className="size-4" /></Button>
              ) : (
                <Button onClick={onSubmit} disabled={submitting}>{submitting ? t("quote.submitting") : t("quote.submit")}</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
