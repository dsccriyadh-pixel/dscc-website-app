import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  ArrowUpRight,
  Bot,
  FileText,
  Mail,
  TrendingUp,
  Users,
  MapPin,
  Wrench,
} from "lucide-react";
import { api } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Spinner } from "@/components/ui/spinner";
import { relativeTime } from "@/lib/format";
import { STATUS_ORDER, sourceKey, statusKey, type LeadStatus } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const { t, lang } = useI18n();
  const { data, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: () => api.stats(),
    refetchInterval: 30000,
  });

  if (isLoading || !data) {
    return (
      <div className="p-8 grid place-items-center h-full">
        <Spinner />
      </div>
    );
  }

  const newLeads = data.byStatus["new"] || 0;
  const quoteLeads = data.bySource["quote"] || 0;
  const contactLeads = data.bySource["contact"] || 0;
  const chatbotLeads = data.bySource["chatbot"] || 0;

  const statusChart = STATUS_ORDER.map((s) => ({
    name: t(statusKey(s)),
    value: data.byStatus[s] || 0,
  }));

  const sourceItems: Array<{ key: "quote" | "contact" | "chatbot" | "newsletter" | "other"; v: number }> = [
    { key: "quote", v: quoteLeads },
    { key: "contact", v: contactLeads },
    { key: "chatbot", v: chatbotLeads },
    { key: "newsletter", v: data.bySource["newsletter"] || 0 },
    { key: "other", v: data.bySource["other"] || 0 },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title={t("overview_title")} description={t("overview_desc")} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Users}
          label={t("stat_total")}
          value={data.total}
          hint={`${data.newLast30Days} ${t("stat_total_hint")}`}
          testid="stat-total"
        />
        <StatCard
          icon={TrendingUp}
          label={t("stat_new")}
          value={newLeads}
          hint={t("stat_new_hint")}
          accent
          testid="stat-new"
        />
        <StatCard
          icon={FileText}
          label={t("stat_quotes")}
          value={quoteLeads}
          hint={t("stat_quotes_hint")}
          testid="stat-quotes"
        />
        <StatCard
          icon={Bot}
          label={t("stat_chatbot")}
          value={chatbotLeads}
          hint={t("stat_chatbot_hint")}
          testid="stat-chatbot"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("pipeline_title")}</CardTitle>
            <CardDescription>{t("pipeline_desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChart} margin={{ top: 8, right: 8, left: -16, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis
                    dataKey="name"
                    fontSize={11}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis fontSize={11} allowDecimals={false} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("source_title")}</CardTitle>
            <CardDescription>{t("source_desc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sourceItems.map(({ key, v }) => {
              const pct = data.total > 0 ? Math.round((v / data.total) * 100) : 0;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      {key === "chatbot" && <Bot className="h-3.5 w-3.5" />}
                      {key === "contact" && <Mail className="h-3.5 w-3.5" />}
                      {key === "quote" && <FileText className="h-3.5 w-3.5" />}
                      {t(sourceKey(key))}
                    </span>
                    <span className="text-muted-foreground tabular-nums" dir="ltr">{v}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t("recent_title")}</CardTitle>
              <CardDescription>{t("recent_desc")}</CardDescription>
            </div>
            <Link href="/leads">
              <a className="text-sm text-primary inline-flex items-center gap-1 hover:underline">
                {t("view_all")} <ArrowUpRight className="h-3 w-3" />
              </a>
            </Link>
          </CardHeader>
          <CardContent>
            {data.recent.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-8">
                {t("no_leads_yet")}
              </div>
            ) : (
              <div className="divide-y">
                {data.recent.map((lead) => (
                  <Link key={lead.id} href={`/leads/${lead.id}`}>
                    <a
                      className="flex items-center gap-3 py-3 hover-elevate -mx-2 px-2 rounded"
                      data-testid={`recent-lead-${lead.id}`}
                    >
                      <div className="h-9 w-9 rounded-full bg-muted grid place-items-center text-xs font-medium shrink-0">
                        {(lead.fullName || "?").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm truncate">
                            {lead.fullName || t("unnamed_lead")}
                          </span>
                          {lead.company && (
                            <span className="text-xs text-muted-foreground">· {lead.company}</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {t(sourceKey(lead.source))} · {lead.city || "—"} ·{" "}
                          {(lead.services || []).slice(0, 2).join(t("list_sep")) || lead.projectType || "—"}
                        </div>
                      </div>
                      <div className="text-end shrink-0">
                        <StatusBadge status={lead.status as LeadStatus} />
                        <div className="text-[11px] text-muted-foreground mt-1">
                          {relativeTime(lead.createdAt, lang)}
                        </div>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wrench className="h-4 w-4" /> {t("top_services")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.topServices.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">{t("no_data_yet")}</div>
              ) : (
                <ul className="space-y-2">
                  {data.topServices.slice(0, 6).map((s) => (
                    <li key={s.name} className="flex justify-between text-sm">
                      <span className="truncate">{s.name}</span>
                      <span className="font-medium tabular-nums" dir="ltr">{s.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4" /> {t("top_cities")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.topCities.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">{t("no_data_yet")}</div>
              ) : (
                <ul className="space-y-2">
                  {data.topCities.slice(0, 6).map((s) => (
                    <li key={s.name} className="flex justify-between text-sm">
                      <span className="truncate">{s.name}</span>
                      <span className="font-medium tabular-nums" dir="ltr">{s.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
  testid,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  hint?: string;
  accent?: boolean;
  testid?: string;
}) {
  return (
    <Card data-testid={testid}>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              {label}
            </div>
            <div className="text-3xl font-semibold mt-1 tabular-nums" dir="ltr">{value}</div>
            {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
          </div>
          <div
            className={`h-9 w-9 rounded-md grid place-items-center shrink-0 ${
              accent ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
