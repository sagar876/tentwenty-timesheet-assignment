import { filterTimesheetsByDateRange } from "../dateRange";
import type { WeekSummary } from "@/features/timesheets/types/timesheet";

function week(id: string, weekNumber: number, startDate: string, endDate: string): WeekSummary {
  return { id, weekNumber, startDate, endDate, status: "completed", totalHours: 40 };
}

const weeks: WeekSummary[] = [
  week("week-1", 1, "2024-01-01", "2024-01-05"),
  week("week-2", 2, "2024-01-08", "2024-01-12"),
  week("week-3", 3, "2024-01-15", "2024-01-19"),
  week("week-9", 9, "2024-02-26", "2024-03-01"),
  week("week-52", 52, "2024-12-23", "2024-12-27"),
  week("week-53", 53, "2024-12-30", "2025-01-03"),
];

describe("filterTimesheetsByDateRange", () => {
  it("returns every week when the range is empty", () => {
    expect(filterTimesheetsByDateRange(weeks, {})).toEqual(weeks);
  });

  it("matches a single week that falls entirely within the range", () => {
    const result = filterTimesheetsByDateRange(weeks, { from: "2024-01-08", to: "2024-01-12" });
    expect(result.map((w) => w.id)).toEqual(["week-2"]);
  });

  it("matches multiple weeks within a wider range", () => {
    const result = filterTimesheetsByDateRange(weeks, { from: "2024-01-01", to: "2024-01-19" });
    expect(result.map((w) => w.id)).toEqual(["week-1", "week-2", "week-3"]);
  });

  it("matches a week that spans two different months", () => {
    const result = filterTimesheetsByDateRange(weeks, { from: "2024-02-01", to: "2024-03-01" });
    expect(result.map((w) => w.id)).toEqual(["week-9"]);
  });

  it("matches a week that spans across a year boundary", () => {
    const result = filterTimesheetsByDateRange(weeks, { from: "2024-12-28", to: "2025-01-03" });
    expect(result.map((w) => w.id)).toEqual(["week-53"]);
  });

  it("includes a week whose dates exactly touch the range boundaries", () => {
    const result = filterTimesheetsByDateRange(weeks, { from: "2024-01-05", to: "2024-01-08" });
    expect(result.map((w) => w.id)).toEqual(["week-1", "week-2"]);
  });

  it("returns no weeks for an inverted (to before from) range", () => {
    const result = filterTimesheetsByDateRange(weeks, { from: "2024-01-19", to: "2024-01-01" });
    expect(result).toEqual([]);
  });
});
