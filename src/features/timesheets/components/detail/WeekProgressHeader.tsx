import { formatDateRange } from "@/features/timesheets/utils/format";
import { WEEK_TARGET_HOURS } from "@/features/timesheets/utils/timesheetStatus";
import type { WeekSummary } from "@/features/timesheets/types/timesheet";

interface WeekProgressHeaderProps {
  week: WeekSummary;
}

export function WeekProgressHeader({ week }: WeekProgressHeaderProps) {
  const percent = Math.min(100, Math.round((week.totalHours / WEEK_TARGET_HOURS) * 100));

  return (
    <div className="border-b border-gray-200 px-6 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">This week&apos;s timesheet</h1>
          <p className="mt-1 text-sm text-gray-500">
            {formatDateRange(week.startDate, week.endDate)}
          </p>
        </div>

        <div className="w-full sm:w-56">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium text-gray-900">
              {week.totalHours}/{WEEK_TARGET_HOURS} hrs
            </span>
            <span className="text-gray-500">{percent}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={week.totalHours}
            aria-valuemin={0}
            aria-valuemax={WEEK_TARGET_HOURS}
            aria-label="Weekly hours logged"
            className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200"
          >
            <div className="h-full rounded-full bg-orange-400" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
