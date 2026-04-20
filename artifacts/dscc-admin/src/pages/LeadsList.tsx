import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Download, Search, Bot, FileText, Mail, Bookmark, Trash2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { api, type LeadFilters } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Spinner } from "@/components/ui/spinner";
import { relativeTime } from "@/lib/format";
import {
  STATUS_ORDER,
  SOURCE_KEYS,
  sourceKey,
  statusKey,
  type Lead,
  type LeadSource,
} from "@/lib/types";
import { getToken } from "@/lib/auth";
import { useI18n, type TKey } from "@/lib/i18n";

const API_BASE =
  ((import.meta as unknown as { env?: { VITE_API_BASE?: string } }).env?.VITE_API_BASE) ||
  "/api";

const VIEWS_KEY = "dscc_admin_saved_views_v1";

interface SavedView {
  id: string;
  name: string;
  filters: LeadFilters;
}

function loadViews(): SavedView[] {
  try {
    const raw = localStorage.getItem(VIEWS_KEY);
    return raw ? (JSON.parse(raw) as SavedView[]) : [];
  } catch {
    return [];
  }
}
function persistViews(v: SavedView[]) {
  try {
    localStorage.setItem(VIEWS_KEY, JSON.stringify(v));
  } catch {}
}

interface Props {
  fixedSource?: LeadSource;
  titleKey?: TKey;
  descriptionKey?: TKey;
}

export default function LeadsList({ fixedSource, titleKey, descriptionKey }: Props) {
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [source, setSource] = useState<string>(fixedSource || "all");
  const [city, setCity] = useState("all");
  const [service, setService] = useState("all");
  const [assigned, setAssigned] = useState("all");
  const [priority, setPriority] = useState("all");
  const [views, setViews] = useState<SavedView[]>(() => loadViews());
  const [newViewName, setNewViewName] = useState("");

  const filters: LeadFilters = useMemo(
    () => ({
      q: q.trim() || undefined,
      status,
      source: fixedSource || source,
      city,
      service,
      assigned,
      priority,
    }),
    [q, status, source, city, service, assigned, priority, fixedSource],
  );

  const { data, isLoading } = useQuery({
    queryKey: ["leads", filters],
    queryFn: () => api.listLeads(filters),
    refetchInterval: 30000,
  });

  const { data: ops } = useQuery({
    queryKey: ["operators"],
    queryFn: () => api.operators(),
    staleTime: 60_000,
  });
  const operators = ops?.operators || [];

  const leads = data?.leads || [];

  const cities = useMemo(() => {
    const s = new Set<string>();
    leads.forEach((l) => l.city && s.add(l.city));
    return Array.from(s).sort();
  }, [leads]);
  const services = useMemo(() => {
    const s = new Set<string>();
    leads.forEach((l) => (l.services || []).forEach((x) => s.add(x)));
    return Array.from(s).sort();
  }, [leads]);
  const assignees = useMemo(() => {
    const s = new Set<string>();
    leads.forEach((l) => l.assignedTo && s.add(l.assignedTo));
    operators.forEach((n) => s.add(n));
    return Array.from(s).sort();
  }, [leads, operators]);

  useEffect(() => {
    persistViews(views);
  }, [views]);

  const saveCurrentView = () => {
    const name = newViewName.trim();
    if (!name) return;
    const view: SavedView = {
      id: `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      name,
      filters: { ...filters, q: q.trim() || undefined },
    };
    setViews((vs) => [view, ...vs.filter((v) => v.name !== name)]);
    setNewViewName("");
    toast.success(t("view_saved"));
  };

  const applyView = (v: SavedView) => {
    setQ(v.filters.q || "");
    setStatus(v.filters.status || "all");
    if (!fixedSource) setSource(v.filters.source || "all");
    setCity(v.filters.city || "all");
    setService(v.filters.service || "all");
    setAssigned(v.filters.assigned || "all");
    setPriority(v.filters.priority || "all");
  };

  const deleteView = (id: string) => {
    setViews((vs) => vs.filter((v) => v.id !== id));
  };

  const downloadCsv = async () => {
    const token = getToken();
    const res = await fetch(`${API_BASE}/admin/leads.csv`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dscc-leads-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader
        title={t(titleKey || "leads_title")}
        description={t(descriptionKey || "leads_desc")}
        actions={
          <Button variant="outline" onClick={downloadCsv} data-testid="button-export-csv">
            <Download className="h-4 w-4 me-2" />
            {t("export_csv")}
          </Button>
        }
      />

      <Card className="p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-2 relative">
            <Search className="h-4 w-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t("search_placeholder")}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="ps-9"
              data-testid="input-search"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger data-testid="select-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_statuses")}</SelectItem>
              {STATUS_ORDER.map((s) => (
                <SelectItem key={s} value={s}>
                  {t(statusKey(s))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!fixedSource && (
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger data-testid="select-source">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all_sources")}</SelectItem>
                {SOURCE_KEYS.map((k) => (
                  <SelectItem key={k} value={k}>
                    {t(sourceKey(k))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger data-testid="select-priority">
              <SelectValue placeholder={t("filter_priority")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_priorities")}</SelectItem>
              <SelectItem value="urgent">{t("prio_urgent_short")}</SelectItem>
              <SelectItem value="high">{t("prio_high_short")}</SelectItem>
              <SelectItem value="normal">{t("prio_normal_short")}</SelectItem>
              <SelectItem value="low">{t("prio_low_short")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={assigned} onValueChange={setAssigned}>
            <SelectTrigger data-testid="select-assigned">
              <SelectValue placeholder={t("filter_assigned")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_assignees")}</SelectItem>
              <SelectItem value="unassigned">{t("unassigned")}</SelectItem>
              {assignees.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger data-testid="select-city">
              <SelectValue placeholder={t("city")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_cities")}</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {services.length > 0 && (
            <Select value={service} onValueChange={setService}>
              <SelectTrigger data-testid="select-service">
                <SelectValue placeholder={t("service")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all_services")}</SelectItem>
                {services.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="mt-3 pt-3 border-t flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Bookmark className="h-3.5 w-3.5" />
            <span className="font-medium">{t("saved_views")}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {views.length === 0 ? (
              <span className="text-xs text-muted-foreground">{t("no_saved_views")}</span>
            ) : (
              views.map((v) => (
                <Badge
                  key={v.id}
                  variant="secondary"
                  className="gap-1 cursor-pointer hover-elevate"
                  data-testid={`view-${v.id}`}
                  onClick={() => applyView(v)}
                >
                  {v.name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteView(v.id);
                    }}
                    className="ms-1 opacity-70 hover:opacity-100"
                    aria-label={t("delete_view")}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
          <div className="flex items-center gap-2">
            <Input
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              placeholder={t("view_name_ph")}
              className="h-8 w-48 text-xs"
              data-testid="input-view-name"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={saveCurrentView}
              disabled={!newViewName.trim()}
              data-testid="button-save-view"
            >
              {t("save_view")}
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <div className="p-12 grid place-items-center">
            <Spinner />
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            {t("no_match")}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("th_lead")}</TableHead>
                <TableHead>{t("th_source")}</TableHead>
                <TableHead>{t("th_city")}</TableHead>
                <TableHead>{t("filter_assigned")}</TableHead>
                <TableHead>{t("th_status")}</TableHead>
                <TableHead className="text-end">{t("th_received")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead: Lead) => (
                <TableRow
                  key={lead.id}
                  className="cursor-pointer hover-elevate"
                  data-testid={`row-lead-${lead.id}`}
                  onClick={() => {
                    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
                    window.location.href = `${base}/leads/${lead.id}`;
                  }}
                >
                  <TableCell>
                    <Link href={`/leads/${lead.id}`}>
                      <a className="block" onClick={(e) => e.stopPropagation()}>
                        <div className="font-medium">{lead.fullName || t("unnamed")}</div>
                        <div className="text-xs text-muted-foreground">
                          {lead.company || lead.email || lead.phone || lead.ref}
                        </div>
                      </a>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      {lead.source === "chatbot" && <Bot className="h-3.5 w-3.5" />}
                      {lead.source === "contact" && <Mail className="h-3.5 w-3.5" />}
                      {lead.source === "quote" && <FileText className="h-3.5 w-3.5" />}
                      {t(sourceKey(lead.source))}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{lead.city || "—"}</TableCell>
                  <TableCell className="text-sm">
                    {lead.assignedTo ? (
                      <span className="inline-flex items-center gap-1">
                        <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        {lead.assignedTo}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/60">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="text-end text-sm text-muted-foreground whitespace-nowrap">
                    {relativeTime(lead.createdAt, lang)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <div className="text-xs text-muted-foreground mt-3">
        {t("showing_x")} <span dir="ltr">{leads.length}</span> {leads.length === 1 ? t("lead_singular") : t("lead_plural")}.
      </div>
    </div>
  );
}
