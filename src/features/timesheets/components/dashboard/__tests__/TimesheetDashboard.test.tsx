import { render, screen, fireEvent } from "@testing-library/react";
import { TimesheetDashboard } from "../TimesheetDashboard";
import { getWeeklyTimesheets } from "@/features/timesheets/services/timesheetsApi";

const pushMock = jest.fn();
const replaceMock = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
  usePathname: () => "/dashboard",
  useSearchParams: () => mockSearchParams,
}));

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

const multiPageResult = {
  ...sampleResult,
  total: 12,
  pageSize: 5,
};

describe("TimesheetDashboard", () => {
  beforeEach(() => {
    mockedGetWeeklyTimesheets.mockReset();
    pushMock.mockClear();
    replaceMock.mockClear();
    mockSearchParams = new URLSearchParams();
  });

  it("shows a table-shaped skeleton before data arrives, without the empty state", () => {
    mockedGetWeeklyTimesheets.mockReturnValue(new Promise(() => {}));
    render(<TimesheetDashboard />);

    expect(screen.getByRole("table", { hidden: true })).toBeInTheDocument();
    expect(screen.getByText(/loading timesheets/i)).toBeInTheDocument();
    expect(screen.queryByText(/no timesheets found/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders the table once data loads", async () => {
    mockedGetWeeklyTimesheets.mockResolvedValue(sampleResult);
    render(<TimesheetDashboard />);

    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(screen.getByText("1 - 5 January, 2024")).toBeInTheDocument();
  });

  it("shows the skeleton again when refetching, then swaps back to real data", async () => {
    mockedGetWeeklyTimesheets.mockResolvedValueOnce(sampleResult);
    const { rerender } = render(<TimesheetDashboard />);
    await screen.findByRole("table");

    let resolveRefetch: (value: typeof sampleResult) => void = () => {};
    mockedGetWeeklyTimesheets.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRefetch = resolve;
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: /sort by date/i }));

    // The App Router re-renders the route with the new searchParams once
    // replace() resolves; simulate that by re-rendering with the URL it was
    // called with.
    mockSearchParams = new URLSearchParams("sort=startDate&order=asc");
    rerender(<TimesheetDashboard />);

    expect(screen.getByText(/loading timesheets/i)).toBeInTheDocument();
    expect(screen.queryByText("1 - 5 January, 2024")).not.toBeInTheDocument();

    resolveRefetch(sampleResult);
    expect(await screen.findByText("1 - 5 January, 2024")).toBeInTheDocument();
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

  describe("URL-driven pagination and sorting", () => {
    it("defaults to page 1, weekNumber asc when no params are present", async () => {
      mockedGetWeeklyTimesheets.mockResolvedValue(sampleResult);
      render(<TimesheetDashboard />);

      await screen.findByRole("table");
      expect(mockedGetWeeklyTimesheets).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, sortBy: "weekNumber", sortDir: "asc" }),
      );
    });

    it("reads page=2 from the URL on a deep-link/refresh", async () => {
      mockSearchParams = new URLSearchParams("page=2");
      mockedGetWeeklyTimesheets.mockResolvedValue({ ...multiPageResult, page: 2 });
      render(<TimesheetDashboard />);

      await screen.findByRole("table");
      expect(mockedGetWeeklyTimesheets).toHaveBeenCalledWith(expect.objectContaining({ page: 2 }));
    });

    it("falls back to page 1 for a non-numeric page value", async () => {
      mockSearchParams = new URLSearchParams("page=abc");
      mockedGetWeeklyTimesheets.mockResolvedValue(sampleResult);
      render(<TimesheetDashboard />);

      await screen.findByRole("table");
      expect(mockedGetWeeklyTimesheets).toHaveBeenCalledWith(expect.objectContaining({ page: 1 }));
    });

    it("falls back to page 1 for a page value below 1", async () => {
      mockSearchParams = new URLSearchParams("page=0");
      mockedGetWeeklyTimesheets.mockResolvedValue(sampleResult);
      render(<TimesheetDashboard />);

      await screen.findByRole("table");
      expect(mockedGetWeeklyTimesheets).toHaveBeenCalledWith(expect.objectContaining({ page: 1 }));
    });

    it("reads a valid sort/order from the URL", async () => {
      mockSearchParams = new URLSearchParams("sort=startDate&order=desc");
      mockedGetWeeklyTimesheets.mockResolvedValue(sampleResult);
      render(<TimesheetDashboard />);

      await screen.findByRole("table");
      expect(mockedGetWeeklyTimesheets).toHaveBeenCalledWith(
        expect.objectContaining({ sortBy: "startDate", sortDir: "desc" }),
      );
    });

    it("falls back to the default sort field for an invalid sort value", async () => {
      mockSearchParams = new URLSearchParams("sort=bogus");
      mockedGetWeeklyTimesheets.mockResolvedValue(sampleResult);
      render(<TimesheetDashboard />);

      await screen.findByRole("table");
      expect(mockedGetWeeklyTimesheets).toHaveBeenCalledWith(expect.objectContaining({ sortBy: "weekNumber" }));
    });

    it("pushes a new URL (not replace) when changing pages", async () => {
      mockedGetWeeklyTimesheets.mockResolvedValue(multiPageResult);
      render(<TimesheetDashboard />);

      fireEvent.click(await screen.findByRole("button", { name: "2" }));

      expect(pushMock).toHaveBeenCalledWith("/dashboard?page=2", { scroll: false });
      expect(replaceMock).not.toHaveBeenCalled();
    });

    it("replaces the URL (not push) when changing sort, without stacking history entries", async () => {
      mockedGetWeeklyTimesheets.mockResolvedValue(sampleResult);
      render(<TimesheetDashboard />);

      fireEvent.click(await screen.findByRole("button", { name: /sort by date/i }));

      expect(replaceMock).toHaveBeenCalledWith("/dashboard?sort=startDate&order=asc", { scroll: false });
      expect(pushMock).not.toHaveBeenCalled();
    });
  });

  describe("URL-driven status and date-range filters", () => {
    async function selectStatus(label: string) {
      fireEvent.click(screen.getByRole("combobox", { name: /status/i }));
      fireEvent.click(await screen.findByRole("option", { name: label }));
    }

    async function selectDateRange(label: string) {
      fireEvent.click(screen.getByRole("combobox", { name: /date range/i }));
      fireEvent.click(await screen.findByRole("option", { name: label }));
    }

    it("defaults to no status or date-range filter when absent", async () => {
      mockedGetWeeklyTimesheets.mockResolvedValue(sampleResult);
      render(<TimesheetDashboard />);

      await screen.findByRole("table");
      expect(mockedGetWeeklyTimesheets).toHaveBeenCalledWith(
        expect.objectContaining({ status: undefined, from: undefined, to: undefined }),
      );
    });

    it("reads a valid status from the URL", async () => {
      mockSearchParams = new URLSearchParams("status=completed");
      mockedGetWeeklyTimesheets.mockResolvedValue(sampleResult);
      render(<TimesheetDashboard />);

      await screen.findByRole("table");
      expect(mockedGetWeeklyTimesheets).toHaveBeenCalledWith(expect.objectContaining({ status: "completed" }));
    });

    it("falls back to no status filter for an invalid status value", async () => {
      mockSearchParams = new URLSearchParams("status=bogus");
      mockedGetWeeklyTimesheets.mockResolvedValue(sampleResult);
      render(<TimesheetDashboard />);

      await screen.findByRole("table");
      expect(mockedGetWeeklyTimesheets).toHaveBeenCalledWith(expect.objectContaining({ status: undefined }));
    });

    it("reads a valid date range from the URL", async () => {
      mockSearchParams = new URLSearchParams("dateRange=2024-02");
      mockedGetWeeklyTimesheets.mockResolvedValue(sampleResult);
      render(<TimesheetDashboard />);

      await screen.findByRole("table");
      expect(mockedGetWeeklyTimesheets).toHaveBeenCalledWith(
        expect.objectContaining({ from: "2024-02-01", to: "2024-02-29" }),
      );
    });

    it("falls back to the default (all dates) for an invalid date-range value", async () => {
      mockSearchParams = new URLSearchParams("dateRange=2099-12");
      mockedGetWeeklyTimesheets.mockResolvedValue(sampleResult);
      render(<TimesheetDashboard />);

      await screen.findByRole("table");
      expect(mockedGetWeeklyTimesheets).toHaveBeenCalledWith(
        expect.objectContaining({ from: undefined, to: undefined }),
      );
    });

    it("pushes the status and resets to page 1 when selecting a status", async () => {
      mockSearchParams = new URLSearchParams("page=5");
      mockedGetWeeklyTimesheets.mockResolvedValue(sampleResult);
      render(<TimesheetDashboard />);
      await screen.findByRole("table");

      await selectStatus("Completed");

      expect(pushMock).toHaveBeenCalledWith("/dashboard?status=completed", { scroll: false });
    });

    it("pushes the date range and resets to page 1 when selecting a date range", async () => {
      mockSearchParams = new URLSearchParams("page=3");
      mockedGetWeeklyTimesheets.mockResolvedValue(sampleResult);
      render(<TimesheetDashboard />);
      await screen.findByRole("table");

      await selectDateRange("February 2024");

      expect(pushMock).toHaveBeenCalledWith("/dashboard?dateRange=2024-02", { scroll: false });
    });

    it("omits the status param when the default 'Status' option is selected", async () => {
      mockSearchParams = new URLSearchParams("status=completed&page=2");
      mockedGetWeeklyTimesheets.mockResolvedValue(sampleResult);
      render(<TimesheetDashboard />);
      await screen.findByRole("table");

      await selectStatus("Status");

      expect(pushMock).toHaveBeenCalledWith("/dashboard", { scroll: false });
    });
  });

  describe("combined URL state", () => {
    it("reads page, sort, order, status, and dateRange together", async () => {
      mockSearchParams = new URLSearchParams(
        "page=2&sort=startDate&order=desc&status=incomplete&dateRange=2024-03",
      );
      mockedGetWeeklyTimesheets.mockResolvedValue({ ...multiPageResult, page: 2 });
      render(<TimesheetDashboard />);

      await screen.findByRole("table");
      expect(mockedGetWeeklyTimesheets).toHaveBeenCalledWith({
        status: "incomplete",
        from: "2024-03-01",
        to: "2024-03-31",
        sortBy: "startDate",
        sortDir: "desc",
        page: 2,
        pageSize: 5,
      });
    });
  });
});
