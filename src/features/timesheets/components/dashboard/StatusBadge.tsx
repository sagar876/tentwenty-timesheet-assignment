import { Badge } from "@/components/ui/badge";
import type { TimesheetStatus } from "@/features/timesheets/types/timesheet";

const STATUS_STYLES: Record<TimesheetStatus, string> = {
  completed: "bg-green-100 text-green-800 hover:bg-green-100",
  incomplete: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  missing: "bg-rose-100 text-rose-800 hover:bg-rose-100",
};

const STATUS_LABEL: Record<TimesheetStatus, string> = {
  completed: "Completed",
  incomplete: "Incomplete",
  missing: "Missing",
};

interface StatusBadgeProps {
  status: TimesheetStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`rounded-md border-transparent font-semibold tracking-wide uppercase ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABEL[status]}
    </Badge>
  );
}
