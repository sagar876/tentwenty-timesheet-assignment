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
  { id: "week-11", weekNumber: 11, startDate: "2024-03-11", endDate: "2024-03-15" },
  { id: "week-12", weekNumber: 12, startDate: "2024-03-18", endDate: "2024-03-22" },
  { id: "week-13", weekNumber: 13, startDate: "2024-03-25", endDate: "2024-03-29" },
  { id: "week-14", weekNumber: 14, startDate: "2024-04-01", endDate: "2024-04-05" },
  { id: "week-15", weekNumber: 15, startDate: "2024-04-08", endDate: "2024-04-12" },
  { id: "week-16", weekNumber: 16, startDate: "2024-04-15", endDate: "2024-04-19" },
  { id: "week-17", weekNumber: 17, startDate: "2024-04-22", endDate: "2024-04-26" },
  { id: "week-18", weekNumber: 18, startDate: "2024-04-29", endDate: "2024-05-03" },
  { id: "week-19", weekNumber: 19, startDate: "2024-05-06", endDate: "2024-05-10" },
  { id: "week-20", weekNumber: 20, startDate: "2024-05-13", endDate: "2024-05-17" },
  { id: "week-21", weekNumber: 21, startDate: "2024-05-20", endDate: "2024-05-24" },
  { id: "week-22", weekNumber: 22, startDate: "2024-05-27", endDate: "2024-05-31" },
  { id: "week-23", weekNumber: 23, startDate: "2024-06-03", endDate: "2024-06-07" },
  { id: "week-24", weekNumber: 24, startDate: "2024-06-10", endDate: "2024-06-14" },
  { id: "week-25", weekNumber: 25, startDate: "2024-06-17", endDate: "2024-06-21" },
  { id: "week-26", weekNumber: 26, startDate: "2024-06-24", endDate: "2024-06-28" },
  { id: "week-27", weekNumber: 27, startDate: "2024-07-01", endDate: "2024-07-05" },
  { id: "week-28", weekNumber: 28, startDate: "2024-07-08", endDate: "2024-07-12" },
  { id: "week-29", weekNumber: 29, startDate: "2024-07-15", endDate: "2024-07-19" },
  { id: "week-30", weekNumber: 30, startDate: "2024-07-22", endDate: "2024-07-26" },
  { id: "week-31", weekNumber: 31, startDate: "2024-07-29", endDate: "2024-08-02" },
  { id: "week-32", weekNumber: 32, startDate: "2024-08-05", endDate: "2024-08-09" },
  { id: "week-33", weekNumber: 33, startDate: "2024-08-12", endDate: "2024-08-16" },
  { id: "week-34", weekNumber: 34, startDate: "2024-08-19", endDate: "2024-08-23" },
  { id: "week-35", weekNumber: 35, startDate: "2024-08-26", endDate: "2024-08-30" },
  { id: "week-36", weekNumber: 36, startDate: "2024-09-02", endDate: "2024-09-06" },
  { id: "week-37", weekNumber: 37, startDate: "2024-09-09", endDate: "2024-09-13" },
  { id: "week-38", weekNumber: 38, startDate: "2024-09-16", endDate: "2024-09-20" },
  { id: "week-39", weekNumber: 39, startDate: "2024-09-23", endDate: "2024-09-27" },
  { id: "week-40", weekNumber: 40, startDate: "2024-09-30", endDate: "2024-10-04" },
  { id: "week-41", weekNumber: 41, startDate: "2024-10-07", endDate: "2024-10-11" },
  { id: "week-42", weekNumber: 42, startDate: "2024-10-14", endDate: "2024-10-18" },
  { id: "week-43", weekNumber: 43, startDate: "2024-10-21", endDate: "2024-10-25" },
  { id: "week-44", weekNumber: 44, startDate: "2024-10-28", endDate: "2024-11-01" },
  { id: "week-45", weekNumber: 45, startDate: "2024-11-04", endDate: "2024-11-08" },
  { id: "week-46", weekNumber: 46, startDate: "2024-11-11", endDate: "2024-11-15" },
  { id: "week-47", weekNumber: 47, startDate: "2024-11-18", endDate: "2024-11-22" },
  { id: "week-48", weekNumber: 48, startDate: "2024-11-25", endDate: "2024-11-29" },
  { id: "week-49", weekNumber: 49, startDate: "2024-12-02", endDate: "2024-12-06" },
  { id: "week-50", weekNumber: 50, startDate: "2024-12-09", endDate: "2024-12-13" },
];

export function getAllWeeks(): MockWeek[] {
  return WEEKS;
}

export function findWeekById(weekId: string): MockWeek | undefined {
  return WEEKS.find((week) => week.id === weekId);
}
