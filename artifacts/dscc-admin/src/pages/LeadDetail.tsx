import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  Calendar,
  Clock,
  FileIcon,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Trash2,
  User,
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { MessageTemplates } from "@/components/MessageTemplates";
import { formatDate, relativeTime } from "@/lib/format";
import {
  STATUS_ORDER,
  sourceKey,
  statusKey,
  type LeadStatus,
} from "@/lib/types";
import { useI18n, type TKey } from "@/lib/i18n";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const UNASSIGNED = "__unassigned__";

export default function LeadDetail() {
  const params = useParams<{ id: string }>();
  const id = params.id!;
  const qc = useQueryClient();
  const [note, setNote] = useState("");
  const [outcome, setOutcome] = useState("");
  const [followUpAt, setFollowUpAt] = useState("");
  const { t, lang } = useI18n();
  const dateLocale = lang === "ar" ? "ar-SA" : undefined;

  const { data, isLoading } = useQuery({
    queryKey: ["lead", id],
    queryFn: () => api.getLead(id),
  });
  const { data: ops } = useQuery({
    queryKey: ["operators"],
    queryFn: () => api.operators(),
    staleTime: 60_000,
  });
  const operators = ops?.operators || [];

  const updateMut = useMutation({
    mutationFn: (patch: Record<string, unknown>) => api.updateLead(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lead", id] });
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  const noteMut = useMutation({
    mutationFn: () => {
      let fuIso: string | undefined;
      if (followUpAt) {
        const t = Date.parse(followUpAt);
        if (!Number.isNaN(t)) fuIso = new Date(t).toISOString();
      }
      return api.addNote(id, note, {
        outcome: outcome || undefined,
        followUpAt: fuIso,
      });
    },
    onSuccess: () => {
      setNote("");
      setOutcome("");
      setFollowUpAt("");
      qc.invalidateQueries({ queryKey: ["lead", id] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (err) => {
      toast.error((err as Error).message);
    },
  });

  const deleteMut = useMutation({
    mutationFn: () => api.deleteLead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      window.location.href = `${base}/leads`;
    },
  });

  if (isLoading || !data) {
    return (
      <div className="h-full grid place-items-center">
        <Spinner />
      </div>
    );
  }
  const lead = data.lead;

  const prioKey = (`prio_${lead.priority}` as TKey);

  const outcomeLabel = (raw?: string) => {
    if (!raw) return "";
    const map: Record<string, TKey> = {
      called: "out_called",
      emailed: "out_emailed",
      meeting_scheduled: "out_meeting",
      quote_sent: "out_quote",
      no_answer: "out_noanswer",
      not_interested: "out_notinterested",
    };
    const k = map[raw];
    return k ? t(k) : raw.replace(/_/g, " ");
  };

  const fmtDateTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(dateLocale, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/leads">
          <a className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 me-1 rtl:rotate-180" /> {t("back_to_leads")}
          </a>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold tracking-tight" data-testid="text-lead-name">
              {lead.fullName || t("unnamed_lead")}
            </h1>
            <StatusBadge status={lead.status} />
            <Badge variant="outline">{t(sourceKey(lead.source))}</Badge>
            {lead.priority !== "normal" && (
              <Badge variant="outline">{t(prioKey)}</Badge>
            )}
            {lead.assignedTo && (
              <Badge variant="secondary" className="gap-1">
                <User className="h-3 w-3" /> {lead.assignedTo}
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {t("ref")} <code className="font-mono">{lead.ref}</code> · {t("received_at")}{" "}
            <span dir="ltr">{formatDate(lead.createdAt, dateLocale)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" data-testid="button-open-templates">
                <Send className="h-4 w-4 me-1.5" />
                {t("templates_title")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t("templates_title")}</DialogTitle>
                <DialogDescription>{t("templates_desc")}</DialogDescription>
              </DialogHeader>
              <MessageTemplates lead={lead} />
            </DialogContent>
          </Dialog>
          <Select
            value={lead.assignedTo || UNASSIGNED}
            onValueChange={(v) =>
              updateMut.mutate({ assignedTo: v === UNASSIGNED ? "" : v })
            }
          >
            <SelectTrigger className="w-[180px]" data-testid="select-assign">
              <SelectValue placeholder={t("assign")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNASSIGNED}>{t("unassigned")}</SelectItem>
              {operators.length === 0 && lead.assignedTo && (
                <SelectItem value={lead.assignedTo}>{lead.assignedTo}</SelectItem>
              )}
              {operators.map((op) => (
                <SelectItem key={op} value={op}>
                  {op}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={lead.status}
            onValueChange={(v) => updateMut.mutate({ status: v as LeadStatus })}
          >
            <SelectTrigger className="w-[180px]" data-testid="select-update-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_ORDER.map((s) => (
                <SelectItem key={s} value={s}>
                  {t(statusKey(s))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={lead.priority}
            onValueChange={(v) => updateMut.mutate({ priority: v })}
          >
            <SelectTrigger className="w-[140px]" data-testid="select-update-priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">{t("prio_low_short")}</SelectItem>
              <SelectItem value="normal">{t("prio_normal_short")}</SelectItem>
              <SelectItem value="high">{t("prio_high_short")}</SelectItem>
              <SelectItem value="urgent">{t("prio_urgent_short")}</SelectItem>
            </SelectContent>
          </Select>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-delete-lead">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("delete_lead_q")}</AlertDialogTitle>
                <AlertDialogDescription>{t("delete_lead_desc")}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMut.mutate()}
                  className="bg-destructive text-destructive-foreground"
                >
                  {t("delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {operators.length === 0 && (
        <div className="text-xs text-muted-foreground bg-muted/40 border rounded-md px-3 py-2 mb-4">
          {t("no_operators_hint")}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("contact_card")}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                <Field icon={User} label={t("full_name")} value={lead.fullName} />
                <Field icon={Building2} label={t("company")} value={lead.company} />
                <Field
                  icon={Mail}
                  label={t("email")}
                  value={lead.email}
                  href={lead.email ? `mailto:${lead.email}` : undefined}
                />
                <Field
                  icon={Phone}
                  label={t("phone")}
                  value={lead.phone}
                  href={lead.phone ? `tel:${lead.phone}` : undefined}
                />
                <Field icon={MapPin} label={t("city")} value={lead.city} />
                <Field icon={Calendar} label={t("created")} value={formatDate(lead.createdAt, dateLocale)} />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("project_request")}</CardTitle>
              <CardDescription>
                {t("submitted_via")} {t(sourceKey(lead.source))}
                {lead.sourcePage && <> {t("from")} {lead.sourcePage}</>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm mb-4">
                <Field label={t("project_type")} value={lead.projectType} />
                <Field label={t("project_size")} value={lead.projectSize} />
                <Field label={t("budget")} value={lead.budget} />
                <Field label={t("timeline")} value={lead.timeline} />
                <Field label={t("source_action")} value={lead.sourceAction} />
                <Field label={t("intent")} value={lead.intent} />
              </dl>
              {lead.services && lead.services.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                    {t("services_label")}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.services.map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {lead.recommendedServices && lead.recommendedServices.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                    {t("recommended")}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.recommendedServices.map((s) => (
                      <Badge key={s} variant="outline">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {lead.message && (
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                    {t("message")}
                  </div>
                  <div className="text-sm whitespace-pre-wrap bg-muted/40 rounded-md p-3 border">
                    {lead.message}
                  </div>
                </div>
              )}
              {lead.chatbotSummary && (
                <div className="mt-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                    {t("conv_summary")}
                  </div>
                  <div className="text-sm whitespace-pre-wrap bg-muted/40 rounded-md p-3 border">
                    {lead.chatbotSummary}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {lead.files && lead.files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("attachments")}</CardTitle>
                <CardDescription>{t("attachments_desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lead.files.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 p-2 rounded border bg-muted/20">
                      <FileIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{f.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {f.type || t("file_label")}
                          {typeof f.size === "number" && (
                            <> · <span dir="ltr">{(f.size / 1024).toFixed(1)} KB</span></>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {lead.raw && Object.keys(lead.raw).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("raw_payload")}</CardTitle>
                <CardDescription>{t("raw_desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted/40 rounded-md p-3 border overflow-auto max-h-96" dir="ltr">
                  {JSON.stringify(lead.raw, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> {t("internal_notes")}
              </CardTitle>
              <CardDescription>{t("notes_desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder={t("add_note_ph")}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                data-testid="textarea-note"
              />
              <Select value={outcome} onValueChange={setOutcome}>
                <SelectTrigger data-testid="select-outcome">
                  <SelectValue placeholder={t("outcome_optional")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="called">{t("out_called")}</SelectItem>
                  <SelectItem value="emailed">{t("out_emailed")}</SelectItem>
                  <SelectItem value="meeting_scheduled">{t("out_meeting")}</SelectItem>
                  <SelectItem value="quote_sent">{t("out_quote")}</SelectItem>
                  <SelectItem value="no_answer">{t("out_noanswer")}</SelectItem>
                  <SelectItem value="not_interested">{t("out_notinterested")}</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  {t("followup_optional")}
                </label>
                <Input
                  type="datetime-local"
                  value={followUpAt}
                  onChange={(e) => setFollowUpAt(e.target.value)}
                  data-testid="input-followup"
                  dir="ltr"
                />
              </div>
              <Button
                size="sm"
                disabled={!note.trim() || noteMut.isPending}
                onClick={() => noteMut.mutate()}
                className="w-full"
                data-testid="button-add-note"
              >
                {noteMut.isPending ? t("saving") : t("add_note")}
              </Button>
              <div className="pt-3 border-t space-y-3 max-h-96 overflow-y-auto">
                {lead.notes.length === 0 ? (
                  <div className="text-xs text-muted-foreground text-center py-3">
                    {t("no_notes_yet")}
                  </div>
                ) : (
                  lead.notes.map((n) => (
                    <div key={n.id} className="text-sm">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1 flex-wrap gap-1">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {relativeTime(n.createdAt, lang)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {n.followUpAt && (
                            <Badge variant="outline" className="text-[10px] gap-1">
                              <CalendarClock className="h-3 w-3" />
                              <span dir="ltr">{fmtDateTime(n.followUpAt)}</span>
                            </Badge>
                          )}
                          {n.outcome && (
                            <Badge variant="outline" className="text-[10px]">
                              {outcomeLabel(n.outcome)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap">{n.body}</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
  href?: string;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">
        {label}
      </dt>
      <dd className="text-sm font-medium flex items-center gap-2">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        {value ? (
          href ? (
            <a href={href} className="text-primary hover:underline">
              {value}
            </a>
          ) : (
            <span>{value}</span>
          )
        ) : (
          <span className="text-muted-foreground/60">—</span>
        )}
      </dd>
    </div>
  );
}
