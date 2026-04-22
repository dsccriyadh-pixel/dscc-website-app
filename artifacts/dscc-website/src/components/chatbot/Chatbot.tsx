import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, RotateCcw, X, Zap, Clock, Globe2, ShieldCheck, FileText, MessageCircle as WhatsIcon } from "lucide-react";

const SARA_AVATAR = "/assets/sara-avatar.png";

function cleanReply(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/^\s*#{1,6}\s+/gm, "")
    .replace(/^\s*\*\s+/gm, "- ")
    .replace(/(^|\s)\*(?!\s)([^*\n]+?)\*(?!\w)/g, "$1$2")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

const LINK_REGEX =
  /(\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\))|(https?:\/\/[^\s<>"']+)|((?:^|\s)(\/(?:quote|services|sectors|projects|clients|resources|about|contact)(?:\/[A-Za-z0-9\-_/]*)?))|(\+?\d[\d\s\-]{7,}\d)/g;

function renderMessage(text: string) {
  const nodes: (string | JSX.Element)[] = [];
  let last = 0;
  let key = 0;
  const linkClass = "underline underline-offset-2 font-medium text-primary hover:text-primary/80 break-all";
  text.replace(LINK_REGEX, (match, _md, mdLabel, mdHref, bareUrl, _pathWrap, pathHref, phone, offset: number) => {
    if (offset > last) nodes.push(text.slice(last, offset));
    if (mdHref) {
      nodes.push(
        <a key={`l${key++}`} href={mdHref} target={mdHref.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={linkClass}>{mdLabel}</a>
      );
    } else if (bareUrl) {
      nodes.push(
        <a key={`l${key++}`} href={bareUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>{bareUrl}</a>
      );
    } else if (pathHref) {
      const lead = match.startsWith(" ") || match.startsWith("\n") ? match[0] : "";
      if (lead) nodes.push(lead);
      nodes.push(
        <a key={`l${key++}`} href={pathHref} className={linkClass}>{pathHref}</a>
      );
    } else if (phone) {
      const tel = phone.replace(/[^\d+]/g, "");
      nodes.push(
        <a key={`l${key++}`} href={`tel:${tel}`} className={linkClass} dir="ltr">{phone}</a>
      );
    }
    last = offset + match.length;
    return match;
  });
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { submitLead } from "@/lib/leads";

interface Msg { role: "user" | "assistant"; content: string }

const STORAGE = "dscc_chatbot_history_v2";
const TEASER_KEY = "dscc_chatbot_teaser_dismissed";

const API_BASE =
  ((import.meta as unknown as { env?: { VITE_API_BASE?: string } }).env?.VITE_API_BASE) || "";

export function Chatbot() {
  const { t, lang, isRtl } = useLanguage();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teaserOpen, setTeaserOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // restore history
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setMsgs(parsed.slice(-30));
      }
    } catch {/* ignore */}
  }, []);

  // persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify(msgs.slice(-30))); } catch {/* ignore */}
  }, [msgs]);

  // autoscroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, sending]);

  // teaser
  useEffect(() => {
    if (open) return;
    const dismissed = (() => {
      try { return localStorage.getItem(TEASER_KEY) === "1"; } catch { return false; }
    })();
    if (dismissed) return;
    const timer = setTimeout(() => setTeaserOpen(true), 4000);
    return () => clearTimeout(timer);
  }, [open]);

  function dismissTeaser() {
    setTeaserOpen(false);
    try { localStorage.setItem(TEASER_KEY, "1"); } catch {/* ignore */}
  }

  function reset() {
    setMsgs([]);
    setError(null);
    try { localStorage.removeItem(STORAGE); } catch {/* ignore */}
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setError(null);
    const next: Msg[] = [...msgs, { role: "user", content: trimmed }];
    setMsgs(next);
    setInput("");
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-20) }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "chat failed");
      const reply = cleanReply(String(data.reply || ""));
      setMsgs((m) => [...m, { role: "assistant", content: reply || t("chatbot.empty_reply") }]);

      // Capture as soft lead so internal team sees the conversation
      submitLead({
        source: "chatbot",
        data: { conversation: [...next, { role: "assistant", content: reply }].slice(-10) },
        at: new Date().toISOString(),
      }).catch(() => {/* silent */});
    } catch (e: any) {
      setError(t("chatbot.error_send"));
    } finally {
      setSending(false);
    }
  }

  const greet = lang === "ar"
    ? "أهلاً بك! أنا سارة، مساعدتك الذكية لدى DSCC. اسألني عن خدماتنا، قطاعاتنا، مشاريعنا، أو منهجية العمل — وسأساعدك خلال ثوانٍ."
    : "Hi there! I'm Sara, the DSCC AI assistant. Ask me about our services, sectors, projects, or how we work — I'll help in seconds.";

  const suggestions = lang === "ar"
    ? [
        "ما الخدمات التي تقدّمونها؟",
        "هل تنفّذون مشاريع فنادق؟",
        "ما خطوات تنفيذ المشروع؟",
        "كيف أحصل على عرض سعر؟",
      ]
    : [
        "What services do you offer?",
        "Do you execute hotel projects?",
        "What are your project steps?",
        "How can I get a quotation?",
      ];

  const baseUrl = import.meta.env.BASE_URL;

  return (
    <Sheet open={open} onOpenChange={(o) => { setOpen(o); if (o) dismissTeaser(); }}>
      {/* Teaser */}
      <AnimatePresence>
        {teaserOpen && !open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className={`fixed bottom-24 z-50 max-w-[300px] rounded-2xl bg-card border border-border shadow-2xl p-4 ${isRtl ? "left-6" : "right-6"}`}
          >
            <button
              onClick={dismissTeaser}
              aria-label={t("chatbot.teaser_dismiss")}
              className={`absolute top-2 ${isRtl ? "left-2" : "right-2"} size-6 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground`}
            >
              <X className="size-3.5" />
            </button>
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-full overflow-hidden ring-2 ring-primary/30 shrink-0">
                <img src={SARA_AVATAR} alt="Sara" className="size-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="font-serif text-sm font-semibold text-foreground mb-0.5">{t("chatbot.teaser_title")}</div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{t("chatbot.teaser_body")}</p>
                <SheetTrigger asChild>
                  <Button size="sm" className="w-full gap-1.5">
                    <Sparkles className="size-3.5" /> {t("chatbot.teaser_cta")}
                  </Button>
                </SheetTrigger>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <SheetTrigger asChild>
        <button
          aria-label={t("chatbot.launcher")}
          className={`group fixed bottom-6 z-50 ${isRtl ? "left-6" : "right-6"}`}
        >
          <span className="absolute inset-1 rounded-full bg-primary/30 animate-ping opacity-40" aria-hidden />
          <span className="relative flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-[#6e1432] text-primary-foreground shadow-[0_10px_40px_-10px_rgba(146,27,67,0.6)] ring-2 ring-secondary/40 ps-1.5 pe-4 py-1.5 hover:shadow-[0_14px_48px_-10px_rgba(146,27,67,0.8)] hover:scale-[1.03] active:scale-100 transition">
            <span className="relative shrink-0">
              <span className="block size-9 rounded-full overflow-hidden ring-2 ring-secondary/60 bg-white/10">
                <img src={SARA_AVATAR} alt="Sara" className="size-full object-cover" />
              </span>
              <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 ring-2 ring-primary" aria-hidden />
            </span>
            <span className="text-sm font-medium whitespace-nowrap">{t("chatbot.launcher")}</span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-secondary/90 text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-0.5">
              <Sparkles className="size-2.5" /> AI
            </span>
          </span>
        </button>
      </SheetTrigger>

      {/* Panel */}
      <SheetContent side={isRtl ? "left" : "right"} className="w-full sm:max-w-md p-0 flex flex-col">
        {/* HEADER */}
        <div className="relative bg-gradient-to-br from-primary via-primary to-[#6e1432] text-primary-foreground p-5 overflow-hidden">
          <div className="absolute -top-12 -right-12 size-44 rounded-full bg-secondary/15 blur-2xl" aria-hidden />
          <div className="absolute -bottom-16 -left-10 size-36 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="size-14 rounded-full overflow-hidden ring-2 ring-secondary/60 bg-primary-foreground/10">
                  <img src={SARA_AVATAR} alt="Sara" className="size-full object-cover" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-400 ring-2 ring-primary" aria-hidden />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-lg font-semibold leading-tight">{t("chatbot.title")}</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary text-primary text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5">
                    <Sparkles className="size-2.5" /> AI
                  </span>
                </div>
                <p className="text-xs text-primary-foreground/80 mt-1 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> {t("chatbot.badge_online")} • {t("chatbot.badge_avg")}
                </p>
                <p className="text-[11px] text-primary-foreground/70 mt-1">{t("chatbot.tagline")}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon" onClick={reset} title={t("chatbot.reset")} className="text-primary-foreground hover:bg-primary-foreground/10">
                <RotateCcw className="size-4" />
              </Button>
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  title={t("chatbot.teaser_dismiss")}
                  aria-label={t("chatbot.teaser_dismiss")}
                  className="text-primary-foreground hover:bg-primary-foreground/15 ring-1 ring-primary-foreground/30"
                >
                  <X className="size-5" />
                </Button>
              </SheetClose>
            </div>
          </div>
          <div className="relative mt-4 grid grid-cols-3 gap-2 text-[10.5px] text-primary-foreground/85">
            <div className="flex items-center gap-1.5 rounded-md bg-primary-foreground/10 px-2 py-1.5">
              <Zap className="size-3 text-secondary" /> <span>{t("chatbot.perks_instant")}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-primary-foreground/10 px-2 py-1.5">
              <Clock className="size-3 text-secondary" /> <span>{t("chatbot.perks_24")}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-primary-foreground/10 px-2 py-1.5">
              <Globe2 className="size-3 text-secondary" /> <span>{t("chatbot.perks_bilingual")}</span>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/40">
          {msgs.length === 0 && (
            <>
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed bg-card border border-border whitespace-pre-line">
                  {greet}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {suggestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs rounded-full border border-primary/30 bg-card hover:bg-primary hover:text-primary-foreground px-3 py-1.5 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
                {m.role === "assistant" ? renderMessage(m.content) : m.content}
              </div>
            </div>
          ))}
          {sending && (
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
          {error && (
            <div className="text-xs text-center text-destructive bg-destructive/10 rounded-md py-1.5 px-2">{error}</div>
          )}
        </div>

        {/* INPUT */}
        <div className="border-t bg-background p-3 space-y-2">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chatbot.type_msg")}
              disabled={sending}
              autoFocus
            />
            <Button type="submit" size="icon" disabled={sending || !input.trim()}>
              <Send className="size-4" />
            </Button>
          </form>
          <div className="flex flex-wrap gap-2 justify-center">
            <a href={`${baseUrl.replace(/\/$/, "")}/quote`} className="inline-flex">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                <FileText className="size-3.5" /> {t("chatbot.cta_quote")}
              </Button>
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=966559846519&text=I%27m%20looking%20for%20Solution%20Provider%20(DSCC-WebSite)"
              target="_blank"
              rel="noreferrer"
              className="inline-flex"
            >
              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                <WhatsIcon className="size-3.5" /> {t("chatbot.cta_whatsapp")}
              </Button>
            </a>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground pt-1">
            <ShieldCheck className="size-3" /> <span>{t("chatbot.footer_secure")}</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
