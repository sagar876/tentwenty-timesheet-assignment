export type TimesheetStatus = "completed" | "incomplete" | "missing";

export type WeekSortField = "weekNumber" | "startDate" | "status";
export type SortDirection = "asc" | "desc";

export interface WeekSummary {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  status: TimesheetStatus;
  totalHours: number;
}

export interface TimesheetEntry {
  id: string;
  weekId: string;
  date: string;
  projectId: string;
  projectName: string;
  typeOfWork: string;
  description: string;
  hours: number;
}

export interface Project {
  id: string;
  name: string;
}

export const TYPE_OF_WORK_OPTIONS = [
  "Bug fixes",
  "Feature development",
  "Code review",
  "Testing",
  "Documentation",
  "Meeting",
] as const;

export type TypeOfWork = (typeof TYPE_OF_WORK_OPTIONS)[number];
