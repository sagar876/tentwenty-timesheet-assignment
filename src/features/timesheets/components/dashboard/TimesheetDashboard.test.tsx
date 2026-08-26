import { render, screen, fireEvent } from "@testing-library/react";
import { TimesheetDashboard } from "./TimesheetDashboard";
import { getWeeklyTimesheets } from "@/features/timesheets/services/timesheetsApi";

jest.mock("@/features/timesheets/services/timesheetsApi", () => ({
  getWeeklyTimesheets: jest.fn(),
}));

const mockedGetWeeklyTimesheets = getWeeklyTimesheets as jest.MockedFunction<
  typeof getWeeklyTimesheets
>;

const sampleResult = {
  items: [
    {
      id: "week-1",
      weekNumber: 1,
      startDate: "2024-01-01",
      endDate: "2024-01-05",
      status: "completed" as const,
      totalHours: 40,
    },
  ],
  total: 1,
  page: 1,
  pageSize: 5,
};

describe("TimesheetDashboard", () => {
  beforeEach(() => {
    mockedGetWeeklyTimesheets.mockReset();
  });

  it("shows a loading state before data arrives", () => {
    mockedGetWeeklyTimesheets.mockReturnValue(new Promise(() => {}));
    render(<TimesheetDashboard />);

    expect(screen.getByText(/loading timesheets/i)).toBeInTheDocument();
  });

  it("renders the table once data loads", async () => {
    mockedGetWeeklyTimesheets.mockResolvedValue(sampleResult);
    render(<TimesheetDashboard />);

    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(screen.getByText("1 - 5 January, 2024")).toBeInTheDocument();
  });

  it("shows an empty state when there are no results", async () => {
    mockedGetWeeklyTimesheets.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 5 });
    render(<TimesheetDashboard />);

    expect(await screen.findByText(/no timesheets found/i)).toBeInTheDocument();
  });

  it("shows an error state with a retry button, and retries on click", async () => {
    mockedGetWeeklyTimesheets.mockRejectedValueOnce(new Error("Network error"));
    render(<TimesheetDashboard />);

    expect(await screen.findByText(/network error/i)).toBeInTheDocument();

    mockedGetWeeklyTimesheets.mockResolvedValueOnce(sampleResult);
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));

    expect(await screen.findByRole("table")).toBeInTheDocument();
  });
});
