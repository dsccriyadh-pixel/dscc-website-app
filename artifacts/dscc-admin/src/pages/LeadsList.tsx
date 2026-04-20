import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Download, Search, Bot, FileText, Mail } from "lucide-react";
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

  const filters: LeadFilters = useMemo(
    () => ({
      q: q.trim() || undefined,
      status,
      source: fixedSource || source,
      city,
      service,
    }),
    [q, status, source, city, service, fixedSource],
  );

  const { data, isLoading } = useQuery({
    queryKey: ["leads", filters],
    queryFn: () => api.listLeads(filters),
    refetchInterval: 30000,
  });

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
                <TableHead>{t("th_services")}</TableHead>
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
                  <TableCell className="text-sm max-w-[280px]">
                    <div className="truncate">
                      {(lead.services || []).slice(0, 3).join(t("list_sep")) || lead.projectType || "—"}
                    </div>
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
