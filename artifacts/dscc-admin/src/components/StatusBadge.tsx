import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS, STATUS_LABELS, type LeadStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge
      variant="outline"
      className={`font-medium border ${STATUS_COLORS[status]}`}
      data-testid={`badge-status-${status}`}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}
