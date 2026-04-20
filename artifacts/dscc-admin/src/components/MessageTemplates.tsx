import { useEffect, useMemo, useState } from "react";
import { Mail, MessageCircle, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import type { Lead } from "@/lib/types";
import { TEMPLATES, buildMailtoUrl, buildWhatsAppUrl, type TemplateLang } from "@/lib/templates";

export function MessageTemplates({ lead }: { lead: Lead }) {
  const { t, lang } = useI18n();
  const [tplId, setTplId] = useState<string>(TEMPLATES[0]!.id);
  const [tplLang, setTplLang] = useState<TemplateLang>(lang);
  const tpl = TEMPLATES.find((x) => x.id === tplId) || TEMPLATES[0]!;
  const built = useMemo(() => tpl.build(lead, tplLang), [tpl, lead, tplLang]);
  const [subject, setSubject] = useState(built.subject || "");
  const [body, setBody] = useState(built.body);

  useEffect(() => {
    setSubject(built.subject || "");
    setBody(built.body);
  }, [built]);

  const phone = lead.phone?.trim();
  const email = lead.email?.trim();
  const phoneDigits = phone ? phone.replace(/\D/g, "") : "";
  const phoneOk = phoneDigits.length >= 7;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      toast.success(t("tpl_copied"));
    } catch {
      // ignore
    }
  };

  const onSendWa = () => {
    if (!phone || !phoneOk) {
      toast.error(t("tpl_no_phone"));
      return;
    }
    window.open(buildWhatsAppUrl(phone, body), "_blank", "noopener,noreferrer");
  };

  const onSendEmail = () => {
    if (!email) {
      toast.error(t("tpl_no_email"));
      return;
    }
    window.location.href = buildMailtoUrl(email, subject, body);
  };

  return (
    <div className="space-y-3" dir={tplLang === "ar" ? "rtl" : "ltr"}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Select value={tplId} onValueChange={setTplId}>
          <SelectTrigger data-testid="select-template">
            <SelectValue placeholder={t("tpl_pick")} />
          </SelectTrigger>
          <SelectContent>
            {TEMPLATES.map((x) => (
              <SelectItem key={x.id} value={x.id}>
                {t(x.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={tplLang} onValueChange={(v) => setTplLang(v as TemplateLang)}>
          <SelectTrigger data-testid="select-template-lang">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ar">العربية</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {built.subject !== undefined && (
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={t("tpl_subject")}
          data-testid="input-template-subject"
        />
      )}
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={9}
        className="font-sans text-sm"
        data-testid="textarea-template-body"
      />
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={onSendWa}
          disabled={!phoneOk}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          data-testid="button-send-whatsapp"
        >
          <MessageCircle className="h-4 w-4 me-1.5" />
          {t("tpl_send_wa")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onSendEmail}
          disabled={!email}
          data-testid="button-send-email"
        >
          <Mail className="h-4 w-4 me-1.5" />
          {t("tpl_send_email")}
        </Button>
        <Button size="sm" variant="ghost" onClick={onCopy} data-testid="button-copy-template">
          <Copy className="h-4 w-4 me-1.5" />
          {t("tpl_copy")}
        </Button>
      </div>
    </div>
  );
}
