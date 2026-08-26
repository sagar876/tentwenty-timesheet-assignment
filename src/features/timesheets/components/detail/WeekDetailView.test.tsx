import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { WeekDetailView } from "./WeekDetailView";
import {
  getTimesheetEntries,
  createTimesheet,
  updateTimesheet,
  deleteTimesheet,
} from "@/features/timesheets/services/timesheetsApi";
import { getProjects } from "@/features/timesheets/services/projectsApi";

jest.mock("@/features/timesheets/services/timesheetsApi", () => ({
  getTimesheetEntries: jest.fn(),
  createTimesheet: jest.fn(),
  updateTimesheet: jest.fn(),
  deleteTimesheet: jest.fn(),
}));
jest.mock("@/features/timesheets/services/projectsApi", () => ({
  getProjects: jest.fn(),
}));

const mockedGetTimesheetEntries = getTimesheetEntries as jest.MockedFunction<
  typeof getTimesheetEntries
>;
const mockedCreateTimesheet = createTimesheet as jest.MockedFunction<typeof createTimesheet>;
const mockedUpdateTimesheet = updateTimesheet as jest.MockedFunction<typeof updateTimesheet>;
const mockedDeleteTimesheet = deleteTimesheet as jest.MockedFunction<typeof deleteTimesheet>;
const mockedGetProjects = getProjects as jest.MockedFunction<typeof getProjects>;

async function openEntryMenu(entryDescription: string) {
  const trigger = await screen.findByRole("button", {
    name: new RegExp(`actions for ${entryDescription}`, "i"),
  });
  fireEvent.pointerDown(trigger, { button: 0, pointerId: 1 });
}

const week = {
  id: "week-1",
  weekNumber: 1,
  startDate: "2024-01-01",
  endDate: "2024-01-02",
  status: "incomplete" as const,
  totalHours: 8,
};

const entry = {
  id: "entry-1",
  weekId: "week-1",
  date: "2024-01-01",
  projectId: "project-1",
  projectName: "Client Website Redesign",
  typeOfWork: "Bug fixes",
  description: "Fix login crash",
  hours: 8,
};

describe("WeekDetailView", () => {
  beforeEach(() => {
    mockedGetTimesheetEntries.mockReset();
    mockedCreateTimesheet.mockReset();
    mockedUpdateTimesheet.mockReset();
    mockedDeleteTimesheet.mockReset();
    mockedGetProjects.mockResolvedValue([{ id: "project-1", name: "Client Website Redesign" }]);
  });

  it("renders a day group per date in the week, with entries under the right day", async () => {
    mockedGetTimesheetEntries.mockResolvedValue({ week, entries: [entry] });
    render(<WeekDetailView weekId="week-1" />);

    expect((await screen.findAllByText("Fix login crash")).length).toBeGreaterThan(0);
    expect(screen.getByText("Jan 1")).toBeInTheDocument();
    expect(screen.getByText("Jan 2")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /add new task/i })).toHaveLength(2);
  });

  it("opens the modal in create mode when 'Add new task' is clicked", async () => {
    mockedGetTimesheetEntries.mockResolvedValue({ week, entries: [] });
    render(<WeekDetailView weekId="week-1" />);

    const addButtons = await screen.findAllByRole("button", { name: /add new task/i });
    fireEvent.click(addButtons[0]!);

    expect(await screen.findByRole("heading", { name: /add new entry/i })).toBeInTheDocument();
  });

  it("opens the modal in edit mode, pre-filled, when 'Edit' is chosen from the entry's menu", async () => {
    mockedGetTimesheetEntries.mockResolvedValue({ week, entries: [entry] });
    render(<WeekDetailView weekId="week-1" />);

    await openEntryMenu("Fix login crash");
    fireEvent.click(await screen.findByRole("menuitem", { name: /^edit$/i }));

    expect(await screen.findByRole("heading", { name: /edit entry/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/task description/i)).toHaveValue("Fix login crash");
  });

  it("creates an entry through the API and refetches on success", async () => {
    mockedGetTimesheetEntries
      .mockResolvedValueOnce({ week, entries: [] })
      .mockResolvedValueOnce({ week, entries: [entry] });
    mockedCreateTimesheet.mockResolvedValue(entry);

    render(<WeekDetailView weekId="week-1" />);

    const addButtons = await screen.findAllByRole("button", { name: /add new task/i });
    fireEvent.click(addButtons[0]!);

    fireEvent.click(screen.getByRole("combobox", { name: /select project/i }));
    fireEvent.click(await screen.findByRole("option", { name: "Client Website Redesign" }));
    fireEvent.change(screen.getByLabelText(/task description/i), {
      target: { value: "Fix login crash" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add entry/i }));

    await waitFor(() => expect(mockedCreateTimesheet).toHaveBeenCalledWith("week-1", expect.any(Object)));
    await waitFor(() => expect(mockedGetTimesheetEntries).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(screen.queryByRole("heading", { name: /add new entry/i })).not.toBeInTheDocument(),
    );
  });

  it("updates an entry through the API and refetches on success", async () => {
    mockedGetTimesheetEntries.mockResolvedValue({ week, entries: [entry] });
    mockedUpdateTimesheet.mockResolvedValue(entry);

    render(<WeekDetailView weekId="week-1" />);

    await openEntryMenu("Fix login crash");
    fireEvent.click(await screen.findByRole("menuitem", { name: /^edit$/i }));
    await screen.findByRole("heading", { name: /edit entry/i });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() =>
      expect(mockedUpdateTimesheet).toHaveBeenCalledWith("week-1", "entry-1", expect.any(Object)),
    );
    await waitFor(() => expect(mockedGetTimesheetEntries).toHaveBeenCalledTimes(2));
  });

  it("deletes an entry through the API after confirmation, and refetches", async () => {
    mockedGetTimesheetEntries
      .mockResolvedValueOnce({ week, entries: [entry] })
      .mockResolvedValueOnce({ week, entries: [] });
    mockedDeleteTimesheet.mockResolvedValue(undefined);

    render(<WeekDetailView weekId="week-1" />);

    await openEntryMenu("Fix login crash");
    fireEvent.click(await screen.findByRole("menuitem", { name: /^delete$/i }));

    fireEvent.click(await screen.findByRole("button", { name: /^delete$/i }));

    await waitFor(() => expect(mockedDeleteTimesheet).toHaveBeenCalledWith("week-1", "entry-1"));
    await waitFor(() => expect(mockedGetTimesheetEntries).toHaveBeenCalledTimes(2));
    expect(screen.queryByText("Delete entry?")).not.toBeInTheDocument();
  });

  it("shows an inline error and keeps the confirmation open when delete fails", async () => {
    mockedGetTimesheetEntries.mockResolvedValue({ week, entries: [entry] });
    mockedDeleteTimesheet.mockRejectedValue(new Error("Something went wrong"));

    render(<WeekDetailView weekId="week-1" />);

    await openEntryMenu("Fix login crash");
    fireEvent.click(await screen.findByRole("menuitem", { name: /^delete$/i }));
    fireEvent.click(await screen.findByRole("button", { name: /^delete$/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Something went wrong");
    expect(screen.getByText("Delete entry?")).toBeInTheDocument();
  });
});
