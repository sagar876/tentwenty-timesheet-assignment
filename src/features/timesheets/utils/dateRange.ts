import type { WeekSummary } from "@/features/timesheets/types/timesheet";

export interface DateRange {
  from?: string;
  to?: string;
}

export function filterTimesheetsByDateRange(
  weeks: WeekSummary[],
  dateRange: DateRange,
): WeekSummary[] {
  const { from, to } = dateRange;

  return weeks.filter((week) => {
    if (from && week.endDate < from) return false;
    if (to && week.startDate > to) return false;
    return true;
  });
}
