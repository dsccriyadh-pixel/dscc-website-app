import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Sparkles, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, useBilingual } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cities } from "@/data/cities";
import { sectors } from "@/data/sectors";
import { services } from "@/data/services";
import { buildMailtoLink, buildWhatsAppLink, generateRef, submitLead } from "@/lib/leads";

type Step =
  | "greet" | "type" | "city" | "services" | "size" | "timeline" | "budget" | "scope"
  | "name" | "company" | "phone" | "email" | "summary" | "done";

interface Msg { who: "bot" | "user"; text: string }

interface State {
  type?: string; city?: string; services: string[]; size?: string; timeline?: string;
  budget?: string; scope?: string[]; name?: string; company?: string; phone?: string; email?: string;
}

const STORAGE = "dscc_chatbot_state_v1";

export function Chatbot() {
  const { t, lang, isRtl } = useLanguage();
  const bi = useBilingual();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("greet");
  const [state, setState] = useState<State>({ services: [] });
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [ref] = useState(() => generateRef("SARA"));
  const scrollRef = useRef<HTMLDivElement>(null);

  // restore
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.state) setState(saved.state);
        if (saved.step) setStep(saved.step);
        if (saved.msgs) setMsgs(saved.msgs);
      } else {
        botSay(t("chatbot.greet"));
      }
    } catch {
      botSay(t("chatbot.greet"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify({ step, state, msgs })); } catch {}
  }, [step, state, msgs]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  function botSay(text: string) {
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { who: "bot", text }]);
      setTyping(false);
    }, 500);
  }

  function userSay(text: string) {
    setMsgs((m) => [...m, { who: "user", text }]);
  }

  function advance(next: Step, prompt: string) {
    setStep(next);
    botSay(prompt);
  }

  function reset() {
    localStorage.removeItem(STORAGE);
    setState({ services: [] });
    setStep("greet");
    setMsgs([]);
    setTimeout(() => botSay(t("chatbot.greet")), 100);
  }

  function pick(value: string, label?: string) {
    const display = label ?? value;
    userSay(display);
    switch (step) {
      case "greet":
        advance("type", t("chatbot.ask_type")); break;
      case "type":
        setState((s) => ({ ...s, type: value }));
        advance("city", t("chatbot.ask_city")); break;
      case "city":
        setState((s) => ({ ...s, city: value }));
        advance("services", t("chatbot.ask_services")); break;
      case "size":
        setState((s) => ({ ...s, size: value }));
        advance("timeline", t("chatbot.ask_timeline")); break;
      case "timeline":
        setState((s) => ({ ...s, timeline: value }));
        advance("budget", t("chatbot.ask_budget")); break;
      case "budget":
        setState((s) => ({ ...s, budget: value }));
        advance("scope", t("chatbot.ask_scope")); break;
      default:
        break;
    }
  }

  function toggleService(slug: string) {
    setState((s) => {
      const has = s.services.includes(slug);
      return { ...s, services: has ? s.services.filter((x) => x !== slug) : [...s.services, slug] };
    });
  }

  function confirmServices() {
    const selectedNames = state.services.map((sl) => bi(services.find((s) => s.slug === sl)!.name));
    userSay(selectedNames.join(", ") || "—");
    advance("size", t("chatbot.ask_size"));
  }

  function toggleScope(v: string) {
    setState((s) => {
      const arr = s.scope ?? [];
      const has = arr.includes(v);
      return { ...s, scope: has ? arr.filter((x) => x !== v) : [...arr, v] };
    });
  }

  function confirmScope() {
    userSay((state.scope ?? []).join(", ") || "—");
    advance("name", t("chatbot.ask_name"));
  }

  function submitText() {
    const v = input.trim();
    if (!v) return;
    setInput("");
    userSay(v);
    switch (step) {
      case "name":
        setState((s) => ({ ...s, name: v }));
        advance("company", t("chatbot.ask_company")); break;
      case "company":
        setState((s) => ({ ...s, company: v }));
        advance("phone", t("chatbot.ask_phone")); break;
      case "phone":
        setState((s) => ({ ...s, phone: v }));
        advance("email", t("chatbot.ask_email")); break;
      case "email":
        setState((s) => ({ ...s, email: v }));
        // submit lead and go to summary
        submitLead({ source: "chatbot", data: { ...state, email: v }, ref, at: new Date().toISOString() });
        setStep("summary");
        botSay(t("chatbot.summary_title"));
        break;
      default:
        break;
    }
  }

  const quoteHref = (() => {
    const params = new URLSearchParams();
    if (state.type) params.set("type", state.type);
    if (state.city) params.set("city", state.city);
    if (state.services.length) params.set("services", state.services.join(","));
    if (state.budget) params.set("budget", state.budget);
    if (state.timeline) params.set("timeline", state.timeline);
    return `/quote?${params.toString()}`;
  })();

  const summaryText = `DSCC enquiry ${ref}\nProject type: ${state.type ?? "-"}\nCity: ${state.city ?? "-"}\nServices: ${state.services.join(", ") || "-"}\nSize: ${state.size ?? "-"}\nTimeline: ${state.timeline ?? "-"}\nBudget: ${state.budget ?? "-"}\nScope: ${(state.scope ?? []).join(", ") || "-"}\nContact: ${state.name ?? "-"} / ${state.company ?? "-"} / ${state.phone ?? "-"} / ${state.email ?? "-"}`;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label={t("chatbot.launcher")}
          className={`fixed bottom-6 z-50 flex items-center gap-2 rounded-full bg-primary text-primary-foreground shadow-2xl px-5 py-3 hover:bg-primary/90 transition ${isRtl ? "left-6" : "right-6"}`}
        >
          <Sparkles className="size-5 text-secondary" />
          <span className="text-sm font-medium">{t("chatbot.launcher")}</span>
          <MessageCircle className="size-4" />
        </button>
      </SheetTrigger>
      <SheetContent side={isRtl ? "left" : "right"} className="w-full sm:max-w-md p-0 flex flex-col">
        <div className="bg-primary text-primary-foreground p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-secondary" />
                <h3 className="font-serif text-lg font-semibold">{t("chatbot.title")}</h3>
              </div>
              <p className="text-xs text-primary-foreground/70 mt-1">{t("chatbot.subtitle")}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={reset} title={t("chatbot.reset")} className="text-primary-foreground hover:bg-primary-foreground/10">
              <RotateCcw className="size-4" />
            </Button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/40">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.who === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.who === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl px-4 py-3 text-sm">
                <span className="inline-flex gap-1">
                  <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse" />
                  <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:200ms]" />
                  <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:400ms]" />
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t bg-background p-4 max-h-[42%] overflow-y-auto">
          {step === "greet" && (
            <div className="flex gap-2"><Button onClick={() => pick("yes", t("chatbot.yes"))}>{t("chatbot.yes")}</Button></div>
          )}
          {step === "type" && (
            <div className="flex flex-wrap gap-2">
              {sectors.map((s) => (
                <Button key={s.id} variant="outline" size="sm" onClick={() => pick(s.slug, bi(s.name))}>{bi(s.name)}</Button>
              ))}
            </div>
          )}
          {step === "city" && (
            <div className="flex flex-wrap gap-2">
              {cities.slice(0, 12).map((c) => (
                <Button key={c.key} variant="outline" size="sm" onClick={() => pick(c.key, bi(c.name))}>{bi(c.name)}</Button>
              ))}
            </div>
          )}
          {step === "services" && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {services.map((s) => {
                  const active = state.services.includes(s.slug);
                  return (
                    <Badge key={s.slug} onClick={() => toggleService(s.slug)} variant={active ? "default" : "outline"} className="cursor-pointer">{bi(s.name)}</Badge>
                  );
                })}
              </div>
              <Button size="sm" onClick={confirmServices} disabled={!state.services.length}>{t("common.next")}</Button>
            </div>
          )}
          {step === "size" && (
            <div className="flex flex-wrap gap-2">
              {["< 500 m² / under 20 keys", "500–2,000 m² / 20–80 keys", "2,000–10,000 m² / 80–300 keys", "> 10,000 m² / 300+ keys"].map((v) => (
                <Button key={v} variant="outline" size="sm" onClick={() => pick(v)}>{v}</Button>
              ))}
            </div>
          )}
          {step === "timeline" && (
            <div className="flex flex-wrap gap-2">
              {[["lt3", t("quote.timelines.lt3")], ["3to6", t("quote.timelines.3to6")], ["6to12", t("quote.timelines.6to12")], ["gt12", t("quote.timelines.gt12")], ["tbd", t("quote.timelines.tbd")]].map(([k, l]) => (
                <Button key={k} variant="outline" size="sm" onClick={() => pick(k, l)}>{l}</Button>
              ))}
            </div>
          )}
          {step === "budget" && (
            <div className="flex flex-wrap gap-2">
              {[["lt500", t("quote.budgets.lt500")], ["500to2m", t("quote.budgets.500to2m")], ["2to10m", t("quote.budgets.2to10m")], ["10to50m", t("quote.budgets.10to50m")], ["gt50m", t("quote.budgets.gt50m")]].map(([k, l]) => (
                <Button key={k} variant="outline" size="sm" onClick={() => pick(k, l)}>{l}</Button>
              ))}
            </div>
          )}
          {step === "scope" && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {[["design", t("quote.scopes.design")], ["supply", t("quote.scopes.supply")], ["install", t("quote.scopes.install")], ["turnkey", t("quote.scopes.turnkey")]].map(([k, l]) => {
                  const active = (state.scope ?? []).includes(k);
                  return (
                    <Badge key={k} onClick={() => toggleScope(k)} variant={active ? "default" : "outline"} className="cursor-pointer">{l}</Badge>
                  );
                })}
              </div>
              <Button size="sm" onClick={confirmScope} disabled={!(state.scope ?? []).length}>{t("common.next")}</Button>
            </div>
          )}
          {(step === "name" || step === "company" || step === "phone" || step === "email") && (
            <form onSubmit={(e) => { e.preventDefault(); submitText(); }} className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("chatbot.type_msg")} type={step === "email" ? "email" : "text"} />
              <Button type="submit" size="icon"><Send className="size-4" /></Button>
              {step === "company" && (
                <Button type="button" variant="ghost" size="sm" onClick={() => { setState((s) => ({ ...s, company: "" })); userSay("—"); advance("phone", t("chatbot.ask_phone")); }}>
                  {t("chatbot.skip")}
                </Button>
              )}
            </form>
          )}
          {step === "summary" && (
            <div className="space-y-3">
              <div className="rounded-lg border bg-muted/30 p-3 text-xs leading-relaxed whitespace-pre-line">{summaryText}</div>
              <div className="grid grid-cols-1 gap-2">
                <a href={`${import.meta.env.BASE_URL}${quoteHref.replace(/^\//, "")}`}><Button className="w-full">{t("chatbot.summary_cta_quote")}</Button></a>
                <a href={buildWhatsAppLink(summaryText)} target="_blank" rel="noreferrer"><Button variant="outline" className="w-full">{t("chatbot.summary_cta_whatsapp")}</Button></a>
                <a href={buildMailtoLink(`DSCC enquiry ${ref}`, summaryText)}><Button variant="outline" className="w-full">{t("chatbot.summary_cta_email")}</Button></a>
              </div>
              <p className="text-xs text-muted-foreground text-center">{t("chatbot.thanks")}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
