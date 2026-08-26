import { render, screen, fireEvent } from "@testing-library/react";
import { TimesheetTable } from "../TimesheetTable";
import type { WeekSortField, WeekSummary } from "@/features/timesheets/types/timesheet";

const weeks: WeekSummary[] = [
  {
    id: "week-1",
    weekNumber: 1,
    startDate: "2024-01-01",
    endDate: "2024-01-05",
    status: "completed",
    totalHours: 40,
  },
  {
    id: "week-3",
    weekNumber: 3,
    startDate: "2024-01-15",
    endDate: "2024-01-19",
    status: "incomplete",
    totalHours: 24,
  },
  {
    id: "week-5",
    weekNumber: 5,
    startDate: "2024-01-29",
    endDate: "2024-02-02",
    status: "missing",
    totalHours: 0,
  },
];

function renderTable(overrides: { sortBy?: WeekSortField; onSortChange?: () => void } = {}) {
  return render(
    <TimesheetTable
      weeks={weeks}
      sortBy={overrides.sortBy ?? "weekNumber"}
      sortDir="asc"
      onSortChange={overrides.onSortChange ?? jest.fn()}
    />,
  );
}

describe("TimesheetTable", () => {
  it("renders the column headers, including the non-sortable Actions column", () => {
    renderTable();

    expect(screen.getByRole("button", { name: /sort by week #/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sort by date/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sort by status/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Actions" })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(weeks.length + 1);
  });

  it("renders each week's number, date range, and status", () => {
    renderTable();

    expect(screen.getByRole("cell", { name: "1" })).toBeInTheDocument();
    expect(screen.getByText("1 - 5 January, 2024")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Incomplete")).toBeInTheDocument();
    expect(screen.getByText("Missing")).toBeInTheDocument();
  });

  it("shows the action label matching each week's status", () => {
    renderTable();

    expect(screen.getByRole("link", { name: /view timesheet for week 1/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /update timesheet for week 3/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /create timesheet for week 5/i }),
    ).toBeInTheDocument();
  });

  it("links each action to the week's detail route", () => {
    renderTable();

    expect(screen.getByRole("link", { name: /week 1/i })).toHaveAttribute(
      "href",
      "/timesheets/week-1",
    );
  });

  it("calls onSortChange with the column's field when a sortable header is clicked", () => {
    const onSortChange = jest.fn();
    renderTable({ onSortChange });

    fireEvent.click(screen.getByRole("button", { name: /sort by date/i }));
    expect(onSortChange).toHaveBeenCalledWith("startDate");
  });

  it("shows the current sort direction on the active column", () => {
    renderTable({ sortBy: "status" });

    expect(screen.getByRole("button", { name: /sort by status, currently ascending/i })).toBeInTheDocument();
  });
});
