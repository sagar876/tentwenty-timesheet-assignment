import { computeStatus } from "@/features/timesheets/utils/timesheetStatus";
import { sumHours } from "@/features/timesheets/utils/hours";
import { filterTimesheetsByDateRange } from "@/features/timesheets/utils/dateRange";
import type { EntryInput } from "@/features/timesheets/schemas/entrySchema";
import type {
  SortDirection,
  TimesheetEntry,
  TimesheetStatus,
  WeekSortField,
  WeekSummary,
} from "@/features/timesheets/types/timesheet";
import { getAllWeeks, findWeekById, type MockWeek } from "@/server/timesheets/mockWeeks";
import {
  getEntriesForWeek,
  findEntryById,
  addEntry,
  updateEntry as updateEntryRecord,
  deleteEntry as deleteEntryRecord,
} from "@/server/timesheets/mockEntries";
import { findProjectById } from "@/server/projects/mockProjects";

function toSummary(week: MockWeek): WeekSummary {
  const totalHours = sumHours(getEntriesForWeek(week.id).map((entry) => entry.hours));
  return {
    id: week.id,
    weekNumber: week.weekNumber,
    startDate: week.startDate,
    endDate: week.endDate,
    status: computeStatus(totalHours),
    totalHours,
  };
}

export interface WeekSummaryFilters {
  from?: string;
  to?: string;
  status?: TimesheetStatus;
  sortBy?: WeekSortField;
  sortDir?: SortDirection;
  page?: number;
  pageSize?: number;
}

export interface WeekSummaryPage {
  items: WeekSummary[];
  total: number;
  page: number;
  pageSize: number;
}

function sortSummaries(
  summaries: WeekSummary[],
  sortBy: WeekSortField,
  sortDir: SortDirection,
): WeekSummary[] {
  const sorted = [...summaries].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return -1;
    if (a[sortBy] > b[sortBy]) return 1;
    return 0;
  });
  return sortDir === "desc" ? sorted.reverse() : sorted;
}

export function getWeekSummaries(filters: WeekSummaryFilters = {}): WeekSummaryPage {
  let summaries = getAllWeeks().map(toSummary);

  if (filters.status) {
    summaries = summaries.filter((week) => week.status === filters.status);
  }
  summaries = filterTimesheetsByDateRange(summaries, { from: filters.from, to: filters.to });

  summaries = sortSummaries(summaries, filters.sortBy ?? "weekNumber", filters.sortDir ?? "asc");

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 5;
  const start = (page - 1) * pageSize;

  return {
    items: summaries.slice(start, start + pageSize),
    total: summaries.length,
    page,
    pageSize,
  };
}

export interface WeekDetail {
  week: WeekSummary;
  entries: TimesheetEntry[];
}

export function getWeekDetail(weekId: string): WeekDetail | undefined {
  const week = findWeekById(weekId);
  if (!week) return undefined;

  return { week: toSummary(week), entries: getEntriesForWeek(weekId) };
}

type EntryMutationFailure =
  | { ok: false; reason: "week_not_found" | "entry_not_found" | "project_not_found" };
type EntryMutationSuccess = { ok: true; entry: TimesheetEntry };
export type EntryMutationResult = EntryMutationSuccess | EntryMutationFailure;

export function createEntry(weekId: string, input: EntryInput): EntryMutationResult {
  if (!findWeekById(weekId)) {
    return { ok: false, reason: "week_not_found" };
  }

  const project = findProjectById(input.projectId);
  if (!project) {
    return { ok: false, reason: "project_not_found" };
  }

  const entry = addEntry({
    weekId,
    date: input.date,
    projectId: project.id,
    projectName: project.name,
    typeOfWork: input.typeOfWork,
    description: input.description,
    hours: input.hours,
  });

  return { ok: true, entry };
}

export function updateEntry(weekId: string, entryId: string, input: EntryInput): EntryMutationResult {
  if (!findWeekById(weekId)) {
    return { ok: false, reason: "week_not_found" };
  }

  const existing = findEntryById(entryId);
  if (!existing || existing.weekId !== weekId) {
    return { ok: false, reason: "entry_not_found" };
  }

  const project = findProjectById(input.projectId);
  if (!project) {
    return { ok: false, reason: "project_not_found" };
  }

  const entry = updateEntryRecord(entryId, {
    date: input.date,
    projectId: project.id,
    projectName: project.name,
    typeOfWork: input.typeOfWork,
    description: input.description,
    hours: input.hours,
  });

  return { ok: true, entry: entry! };
}

export type DeleteEntryResult = "deleted" | "week_not_found" | "entry_not_found";

export function deleteEntry(weekId: string, entryId: string): DeleteEntryResult {
  if (!findWeekById(weekId)) {
    return "week_not_found";
  }

  const existing = findEntryById(entryId);
  if (!existing || existing.weekId !== weekId) {
    return "entry_not_found";
  }

  deleteEntryRecord(entryId);
  return "deleted";
}
