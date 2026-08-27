import {
  createEntry,
  updateEntry,
  deleteEntry,
  getWeekDetail,
  getWeekSummaries,
  type EntryMutationResult,
} from "../timesheetService";

function requireEntry(result: EntryMutationResult) {
  if (!result.ok) throw new Error(`Expected a successful mutation, got: ${result.reason}`);
  return result.entry;
}

describe("weekly total hours with decimal entries", () => {
  it("sums decimal entry hours precisely and recalculates on update/delete", () => {
    const first = requireEntry(
      createEntry("week-5", {
        date: "2024-01-29",
        projectId: "project-1",
        typeOfWork: "Testing",
        description: "Regression pass",
        hours: 7.5,
      }),
    );
    const second = requireEntry(
      createEntry("week-5", {
        date: "2024-01-30",
        projectId: "project-1",
        typeOfWork: "Testing",
        description: "More regression",
        hours: 8,
      }),
    );
    const third = requireEntry(
      createEntry("week-5", {
        date: "2024-01-31",
        projectId: "project-1",
        typeOfWork: "Testing",
        description: "Even more regression",
        hours: 6.25,
      }),
    );

    expect(getWeekDetail("week-5")!.week.totalHours).toBe(21.75);

    updateEntry("week-5", second.id, {
      date: "2024-01-30",
      projectId: "project-1",
      typeOfWork: "Testing",
      description: "More regression",
      hours: 8.5,
    });
    expect(getWeekDetail("week-5")!.week.totalHours).toBe(22.25);

    deleteEntry("week-5", third.id);
    expect(getWeekDetail("week-5")!.week.totalHours).toBe(16);

    deleteEntry("week-5", first.id);
    deleteEntry("week-5", second.id);
    expect(getWeekDetail("week-5")!.week.totalHours).toBe(0);
  });

  it("sums arbitrary-precision decimal hours without floating-point drift", () => {
    requireEntry(
      createEntry("week-20", {
        date: "2024-05-13",
        projectId: "project-1",
        typeOfWork: "Testing",
        description: "First pass",
        hours: 1.1,
      }),
    );
    requireEntry(
      createEntry("week-20", {
        date: "2024-05-14",
        projectId: "project-1",
        typeOfWork: "Testing",
        description: "Second pass",
        hours: 2.3,
      }),
    );
    requireEntry(
      createEntry("week-20", {
        date: "2024-05-15",
        projectId: "project-1",
        typeOfWork: "Testing",
        description: "Third pass",
        hours: 4.75,
      }),
    );

    expect(getWeekDetail("week-20")!.week.totalHours).toBe(8.15);
  });
});

describe("getWeekSummaries date range filtering", () => {
  it("returns every week when no date range is given", () => {
    const all = getWeekSummaries();
    const filtered = getWeekSummaries({ from: undefined, to: undefined });
    expect(filtered.total).toBe(all.total);
  });

  it("filters to only the weeks overlapping the selected range", () => {
    const result = getWeekSummaries({ from: "2024-01-01", to: "2024-01-19", pageSize: 50 });
    expect(result.items.map((week) => week.id)).toEqual(["week-1", "week-2", "week-3"]);
    expect(result.total).toBe(3);
  });

  it("clamps to the last valid page when the requested page exceeds the filtered total", () => {
    const result = getWeekSummaries({
      from: "2024-01-01",
      to: "2024-01-05",
      page: 5,
      pageSize: 5,
    });

    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.items).toHaveLength(1);
  });
});
