import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  FileIcon,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
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
import { formatDate, relativeTime } from "@/lib/format";
import {
  SOURCE_LABELS,
  STATUS_LABELS,
  STATUS_ORDER,
  type LeadStatus,
} from "@/lib/types";
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

export default function LeadDetail() {
  const params = useParams<{ id: string }>();
  const id = params.id!;
  const qc = useQueryClient();
  const [note, setNote] = useState("");
  const [outcome, setOutcome] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["lead", id],
    queryFn: () => api.getLead(id),
  });

  const updateMut = useMutation({
    mutationFn: (patch: Record<string, unknown>) => api.updateLead(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lead", id] });
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  const noteMut = useMutation({
    mutationFn: () => api.addNote(id, note, { outcome: outcome || undefined }),
    onSuccess: () => {
      setNote("");
      setOutcome("");
      qc.invalidateQueries({ queryKey: ["lead", id] });
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

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/leads">
          <a className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to leads
          </a>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold tracking-tight" data-testid="text-lead-name">
              {lead.fullName || "Unnamed lead"}
            </h1>
            <StatusBadge status={lead.status} />
            <Badge variant="outline">{SOURCE_LABELS[lead.source]}</Badge>
            {lead.priority !== "normal" && (
              <Badge variant="outline" className="capitalize">
                {lead.priority} priority
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Ref <code className="font-mono">{lead.ref}</code> · received{" "}
            {formatDate(lead.createdAt)}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
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
                  {STATUS_LABELS[s]}
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
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
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
                <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes the lead, notes, and history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMut.mutate()}
                  className="bg-destructive text-destructive-foreground"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                <Field icon={User} label="Full name" value={lead.fullName} />
                <Field icon={Building2} label="Company" value={lead.company} />
                <Field
                  icon={Mail}
                  label="Email"
                  value={lead.email}
                  href={lead.email ? `mailto:${lead.email}` : undefined}
                />
                <Field
                  icon={Phone}
                  label="Phone"
                  value={lead.phone}
                  href={lead.phone ? `tel:${lead.phone}` : undefined}
                />
                <Field icon={MapPin} label="City" value={lead.city} />
                <Field icon={Calendar} label="Created" value={formatDate(lead.createdAt)} />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project request</CardTitle>
              <CardDescription>
                Submitted via {SOURCE_LABELS[lead.source]}
                {lead.sourcePage && <> from {lead.sourcePage}</>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm mb-4">
                <Field label="Project type" value={lead.projectType} />
                <Field label="Project size" value={lead.projectSize} />
                <Field label="Budget" value={lead.budget} />
                <Field label="Timeline" value={lead.timeline} />
                <Field label="Source action" value={lead.sourceAction} />
                <Field label="Intent (chatbot)" value={lead.intent} />
              </dl>
              {lead.services && lead.services.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                    Services
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.services.map((s) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {lead.recommendedServices && lead.recommendedServices.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                    Recommended (chatbot)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.recommendedServices.map((s) => (
                      <Badge key={s} variant="outline">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {lead.message && (
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                    Message
                  </div>
                  <div className="text-sm whitespace-pre-wrap bg-muted/40 rounded-md p-3 border">
                    {lead.message}
                  </div>
                </div>
              )}
              {lead.chatbotSummary && (
                <div className="mt-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                    Conversation summary
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
                <CardTitle className="text-base">Attachments</CardTitle>
                <CardDescription>
                  Uploaded plans, drawings, BOQs and references.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lead.files.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 p-2 rounded border bg-muted/20"
                    >
                      <FileIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{f.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {f.type || "file"}
                          {typeof f.size === "number" && (
                            <> · {(f.size / 1024).toFixed(1)} KB</>
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
                <CardTitle className="text-base">Raw payload</CardTitle>
                <CardDescription>Full submitted data for reference.</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted/40 rounded-md p-3 border overflow-auto max-h-96">
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
                <MessageSquare className="h-4 w-4" /> Internal notes
              </CardTitle>
              <CardDescription>Log calls, follow-ups, and outcomes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Add a note about this lead…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                data-testid="textarea-note"
              />
              <Select value={outcome} onValueChange={setOutcome}>
                <SelectTrigger data-testid="select-outcome">
                  <SelectValue placeholder="Outcome (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="called">Called</SelectItem>
                  <SelectItem value="emailed">Emailed</SelectItem>
                  <SelectItem value="meeting_scheduled">Meeting scheduled</SelectItem>
                  <SelectItem value="quote_sent">Quote sent</SelectItem>
                  <SelectItem value="no_answer">No answer</SelectItem>
                  <SelectItem value="not_interested">Not interested</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                disabled={!note.trim() || noteMut.isPending}
                onClick={() => noteMut.mutate()}
                className="w-full"
                data-testid="button-add-note"
              >
                {noteMut.isPending ? "Saving…" : "Add note"}
              </Button>
              <div className="pt-3 border-t space-y-3 max-h-96 overflow-y-auto">
                {lead.notes.length === 0 ? (
                  <div className="text-xs text-muted-foreground text-center py-3">
                    No notes yet.
                  </div>
                ) : (
                  lead.notes.map((n) => (
                    <div key={n.id} className="text-sm">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {relativeTime(n.createdAt)}
                        </span>
                        {n.outcome && (
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {n.outcome.replace(/_/g, " ")}
                          </Badge>
                        )}
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
