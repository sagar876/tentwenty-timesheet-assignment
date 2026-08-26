import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EntryModal } from "../EntryModal";
import { getProjects } from "@/features/timesheets/services/projectsApi";
import type { TimesheetEntry } from "@/features/timesheets/types/timesheet";

jest.mock("@/features/timesheets/services/projectsApi", () => ({
  getProjects: jest.fn(),
}));

const mockedGetProjects = getProjects as jest.MockedFunction<typeof getProjects>;

const projects = [
  { id: "project-1", name: "Client Website Redesign" },
  { id: "project-2", name: "Mobile App" },
];

const existingEntry: TimesheetEntry = {
  id: "entry-1",
  weekId: "week-1",
  date: "2024-01-01",
  projectId: "project-2",
  projectName: "Mobile App",
  typeOfWork: "Testing",
  description: "Write unit tests",
  hours: 6,
};

async function selectProject(name: string) {
  fireEvent.click(screen.getByRole("combobox", { name: /select project/i }));
  fireEvent.click(await screen.findByRole("option", { name }));
}

describe("EntryModal", () => {
  beforeEach(() => {
    mockedGetProjects.mockResolvedValue(projects);
  });

  it("renders empty defaults in create mode", async () => {
    render(<EntryModal date="2024-01-01" onClose={jest.fn()} onSubmit={jest.fn()} />);

    expect(screen.getByRole("heading", { name: /add new entry/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/task description/i)).toHaveValue("");
    expect(screen.getByLabelText(/^hours$/i)).toHaveValue(1);
    expect(screen.getByRole("button", { name: /add entry/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /more information about selecting a project/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /more information about type of work/i }),
    ).toBeInTheDocument();

    await waitFor(() => expect(mockedGetProjects).toHaveBeenCalled());
  });

  it("pre-fills existing values in edit mode", async () => {
    render(
      <EntryModal date={existingEntry.date} entry={existingEntry} onClose={jest.fn()} onSubmit={jest.fn()} />,
    );

    expect(screen.getByRole("heading", { name: /edit entry/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/task description/i)).toHaveValue("Write unit tests");
    expect(screen.getByLabelText(/^hours$/i)).toHaveValue(6);
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });

  it("shows validation errors and does not submit when description is empty", async () => {
    const onSubmit = jest.fn();
    render(<EntryModal date="2024-01-01" onClose={jest.fn()} onSubmit={onSubmit} />);

    await selectProject("Mobile App");
    fireEvent.click(screen.getByRole("button", { name: /add entry/i }));

    expect(await screen.findByText(/task description is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("adjusts hours with the +/- buttons within 0.25-24 bounds", async () => {
    render(<EntryModal date="2024-01-01" onClose={jest.fn()} onSubmit={jest.fn()} />);

    const hoursInput = screen.getByLabelText(/^hours$/i);
    expect(screen.getByLabelText(/decrease hours/i)).not.toBeDisabled();

    fireEvent.click(screen.getByLabelText(/increase hours/i));
    expect(hoursInput).toHaveValue(2);

    fireEvent.click(screen.getByLabelText(/decrease hours/i));
    fireEvent.click(screen.getByLabelText(/decrease hours/i));
    expect(hoursInput).toHaveValue(0.25);
    expect(screen.getByLabelText(/decrease hours/i)).toBeDisabled();
  });

  it("accepts and submits decimal hours without truncating", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<EntryModal date="2024-01-03" onClose={jest.fn()} onSubmit={onSubmit} />);

    await selectProject("Client Website Redesign");
    fireEvent.change(screen.getByLabelText(/task description/i), {
      target: { value: "Investigate flaky test" },
    });
    fireEvent.change(screen.getByLabelText(/^hours$/i), { target: { value: "7.5" } });
    fireEvent.click(screen.getByRole("button", { name: /add entry/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]![0]).toMatchObject({ hours: 7.5 });
  });

  it("rejects hours that aren't in quarter-hour increments", async () => {
    const onSubmit = jest.fn();
    render(<EntryModal date="2024-01-01" onClose={jest.fn()} onSubmit={onSubmit} />);

    await selectProject("Mobile App");
    fireEvent.change(screen.getByLabelText(/task description/i), { target: { value: "Something" } });
    fireEvent.change(screen.getByLabelText(/^hours$/i), { target: { value: "1.3" } });
    fireEvent.click(screen.getByRole("button", { name: /add entry/i }));

    expect(await screen.findByText(/increments of 0.25/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects negative hours", async () => {
    const onSubmit = jest.fn();
    render(<EntryModal date="2024-01-01" onClose={jest.fn()} onSubmit={onSubmit} />);

    await selectProject("Mobile App");
    fireEvent.change(screen.getByLabelText(/task description/i), { target: { value: "Something" } });
    fireEvent.change(screen.getByLabelText(/^hours$/i), { target: { value: "-1" } });
    fireEvent.click(screen.getByRole("button", { name: /add entry/i }));

    expect(await screen.findByText(/hours must be greater than 0/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits the merged values (including the fixed date) when valid", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<EntryModal date="2024-01-03" onClose={jest.fn()} onSubmit={onSubmit} />);

    await selectProject("Client Website Redesign");
    fireEvent.change(screen.getByLabelText(/task description/i), {
      target: { value: "Investigate flaky test" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add entry/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]![0]).toMatchObject({
      date: "2024-01-03",
      projectId: "project-1",
      description: "Investigate flaky test",
      hours: 1,
    });
  });

  it("shows a form-level error and re-enables the form when the API call fails", async () => {
    const onSubmit = jest.fn().mockRejectedValue(new Error("Week not found"));
    render(<EntryModal date="2024-01-01" onClose={jest.fn()} onSubmit={onSubmit} />);

    await selectProject("Client Website Redesign");
    fireEvent.change(screen.getByLabelText(/task description/i), { target: { value: "Something" } });
    fireEvent.click(screen.getByRole("button", { name: /add entry/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/week not found/i);
    expect(screen.getByRole("button", { name: /add entry/i })).not.toBeDisabled();
  });

  it("disables Cancel and the close button while submitting", async () => {
    let resolveSubmit: () => void = () => {};
    const onSubmit = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );
    render(<EntryModal date="2024-01-01" onClose={jest.fn()} onSubmit={onSubmit} />);

    await selectProject("Client Website Redesign");
    fireEvent.change(screen.getByLabelText(/task description/i), { target: { value: "Something" } });
    fireEvent.click(screen.getByRole("button", { name: /add entry/i }));

    await waitFor(() => expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled());
    expect(screen.getByRole("button", { name: /close/i })).toBeDisabled();

    resolveSubmit();
  });
});
