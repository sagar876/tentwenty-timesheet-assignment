import type { TimesheetStatus } from "@/features/timesheets/types/timesheet";

export const WEEK_TARGET_HOURS = 40;

export function computeStatus(totalHours: number): TimesheetStatus {
  if (totalHours <= 0) return "missing";
  if (totalHours >= WEEK_TARGET_HOURS) return "completed";
  return "incomplete";
}
