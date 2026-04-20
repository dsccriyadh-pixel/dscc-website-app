import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS, type LeadStatus, statusKey } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

export function StatusBadge({ status }: { status: LeadStatus }) {
  const { t } = useI18n();
  return (
    <Badge
      variant="outline"
      className={`font-medium border ${STATUS_COLORS[status]}`}
      data-testid={`badge-status-${status}`}
    >
      {t(statusKey(status))}
    </Badge>
  );
}
