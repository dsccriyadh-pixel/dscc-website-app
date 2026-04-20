import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AlertTriangle, CalendarDays, CalendarClock, ArrowUpRight, User as UserIcon } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import type { FollowUpItem } from "@/lib/types";

export default function Today() {
  const { t, lang } = useI18n();
  const dateLocale = lang === "ar" ? "ar-SA" : undefined;
  const { data, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: () => api.stats(),
    refetchInterval: 60000,
  });

  if (isLoading || !data) {
    return (
      <div className="p-8 grid place-items-center h-full">
        <Spinner />
      </div>
    );
  }

  const fmtDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(dateLocale, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return iso;
    }
  };

  const Section = ({
    title,
    desc,
    items,
    icon: Icon,
    tone,
  }: {
    title: string;
    desc?: string;
    items: FollowUpItem[];
    icon: React.ComponentType<{ className?: string }>;
    tone: "danger" | "primary" | "muted";
  }) => {
    const toneClass =
      tone === "danger"
        ? "text-rose-700 dark:text-rose-300"
        : tone === "primary"
          ? "text-primary"
          : "text-muted-foreground";
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className={`h-4 w-4 ${toneClass}`} />
            {title}
            <Badge variant="outline" className="ms-auto tabular-nums" dir="ltr">
              {items.length}
            </Badge>
          </CardTitle>
          {desc && <CardDescription>{desc}</CardDescription>}
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-6">{t("today_none")}</div>
          ) : (
            <ul className="divide-y">
              {items.map((it) => (
                <li key={it.noteId} className="py-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link href={`/leads/${it.leadId}`}>
                          <a className="font-medium text-sm hover:underline" data-testid={`fu-lead-${it.leadId}`}>
                            {it.leadName}
                          </a>
                        </Link>
                        <code className="text-[10px] text-muted-foreground font-mono">{it.leadRef}</code>
                        {it.assignedTo && (
                          <Badge variant="secondary" className="text-[10px] gap-1">
                            <UserIcon className="h-3 w-3" />
                            {it.assignedTo}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                        {it.body}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1" dir="ltr">
                        {fmtDate(it.followUpAt)}
                      </div>
                    </div>
                    <Link href={`/leads/${it.leadId}`}>
                      <a className="text-xs text-primary inline-flex items-center gap-1 shrink-0 hover:underline">
                        {t("open_lead")} <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <PageHeader title={t("today_title")} description={t("today_desc")} />
      <div className="space-y-6">
        <Section
          title={t("today_overdue")}
          items={data.overdueFollowUps}
          icon={AlertTriangle}
          tone="danger"
        />
        <Section
          title={t("today_due")}
          items={data.todayFollowUps}
          icon={CalendarDays}
          tone="primary"
        />
        <Section
          title={t("today_upcoming")}
          items={data.upcomingFollowUps}
          icon={CalendarClock}
          tone="muted"
        />
      </div>
    </div>
  );
}
