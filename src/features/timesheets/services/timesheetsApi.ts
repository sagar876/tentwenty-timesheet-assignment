import { parseJsonOrThrow, throwIfNotOk } from "@/lib/http";
import type { EntryInput } from "@/features/timesheets/schemas/entrySchema";
import type {
  SortDirection,
  TimesheetEntry,
  TimesheetStatus,
  WeekSortField,
  WeekSummary,
} from "@/features/timesheets/types/timesheet";

export interface WeeklyTimesheetsQuery {
  from?: string;
  to?: string;
  status?: TimesheetStatus;
  sortBy?: WeekSortField;
  sortDir?: SortDirection;
  page?: number;
  pageSize?: number;
}

export interface WeeklyTimesheetsResult {
  items: WeekSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getWeeklyTimesheets(
  query: WeeklyTimesheetsQuery = {},
): Promise<WeeklyTimesheetsResult> {
  const params = new URLSearchParams();
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.status) params.set("status", query.status);
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortDir) params.set("sortDir", query.sortDir);
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));

  const response = await fetch(`/api/timesheets?${params.toString()}`);
  return parseJsonOrThrow<WeeklyTimesheetsResult>(response);
}

export interface WeekDetailResult {
  week: WeekSummary;
  entries: TimesheetEntry[];
}

export async function getTimesheetEntries(weekId: string): Promise<WeekDetailResult> {
  const response = await fetch(`/api/timesheets/${weekId}`);
  return parseJsonOrThrow<WeekDetailResult>(response);
}

export async function createTimesheet(weekId: string, input: EntryInput): Promise<TimesheetEntry> {
  const response = await fetch(`/api/timesheets/${weekId}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseJsonOrThrow<TimesheetEntry>(response);
}

export async function updateTimesheet(
  weekId: string,
  entryId: string,
  input: EntryInput,
): Promise<TimesheetEntry> {
  const response = await fetch(`/api/timesheets/${weekId}/entries/${entryId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseJsonOrThrow<TimesheetEntry>(response);
}

export async function deleteTimesheet(weekId: string, entryId: string): Promise<void> {
  const response = await fetch(`/api/timesheets/${weekId}/entries/${entryId}`, {
    method: "DELETE",
  });
  await throwIfNotOk(response);
}
