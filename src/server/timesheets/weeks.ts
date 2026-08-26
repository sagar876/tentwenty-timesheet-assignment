export interface MockWeek {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
}

export const WEEKS: MockWeek[] = [
  { id: "week-1", weekNumber: 1, startDate: "2024-01-01", endDate: "2024-01-05" },
  { id: "week-2", weekNumber: 2, startDate: "2024-01-08", endDate: "2024-01-12" },
  { id: "week-3", weekNumber: 3, startDate: "2024-01-15", endDate: "2024-01-19" },
  { id: "week-4", weekNumber: 4, startDate: "2024-01-22", endDate: "2024-01-26" },
  { id: "week-5", weekNumber: 5, startDate: "2024-01-29", endDate: "2024-02-02" },
  { id: "week-6", weekNumber: 6, startDate: "2024-02-05", endDate: "2024-02-09" },
  { id: "week-7", weekNumber: 7, startDate: "2024-02-12", endDate: "2024-02-16" },
  { id: "week-8", weekNumber: 8, startDate: "2024-02-19", endDate: "2024-02-23" },
  { id: "week-9", weekNumber: 9, startDate: "2024-02-26", endDate: "2024-03-01" },
  { id: "week-10", weekNumber: 10, startDate: "2024-03-04", endDate: "2024-03-08" },
];

export function findWeekById(weekId: string): MockWeek | undefined {
  return WEEKS.find((week) => week.id === weekId);
}
