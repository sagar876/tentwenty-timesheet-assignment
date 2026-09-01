import { render, screen, fireEvent } from "@testing-library/react";
import { DateRangeFilter } from "../DateRangeFilter";

// The real Calendar renders a full react-day-picker grid; its internal
// range-selection merging isn't our code, so tests stub it down to buttons
// that call onSelect with a fixed DateRange, and only assert on how
// DateRangeFilter reacts to that.
jest.mock("@/components/ui/calendar", () => ({
  Calendar: ({
    onSelect,
  }: {
    onSelect: (range: { from?: Date; to?: Date } | undefined) => void;
  }) => (
    <button
      type="button"
      onClick={() => onSelect({ from: new Date(2024, 1, 1), to: new Date(2024, 1, 29) })}
    >
      Pick Feb 1 to Feb 29
    </button>
  ),
}));

describe("DateRangeFilter", () => {
  it("shows the placeholder when no range is selected", () => {
    render(<DateRangeFilter value={{ from: undefined, to: undefined }} onChange={jest.fn()} />);
    expect(screen.getByRole("button", { name: "Date Range" })).toBeInTheDocument();
  });

  it("supports a custom placeholder", () => {
    render(<DateRangeFilter value={{ from: undefined, to: undefined }} onChange={jest.fn()} placeholder="Pick dates" />);
    expect(screen.getByRole("button", { name: "Pick dates" })).toBeInTheDocument();
  });

  it("formats a selected range on the trigger button", () => {
    render(
      <DateRangeFilter
        value={{ from: new Date(2024, 0, 1), to: new Date(2024, 0, 5) }}
        onChange={jest.fn()}
      />,
    );
    // The aria-label stays a stable "Date Range" regardless of the selected
    // value (a screen reader should always describe the control, not the
    // ever-changing selection) - so assert on the visible text instead.
    expect(screen.getByText("Jan 1, 2024 - Jan 5, 2024")).toBeInTheDocument();
  });

  it("does not call onChange until Apply is clicked", () => {
    const onChange = jest.fn();
    render(<DateRangeFilter value={{ from: undefined, to: undefined }} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));
    fireEvent.click(screen.getByRole("button", { name: /pick feb 1 to feb 29/i }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("calls onChange with the picked range when Apply is clicked", () => {
    const onChange = jest.fn();
    render(<DateRangeFilter value={{ from: undefined, to: undefined }} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));
    fireEvent.click(screen.getByRole("button", { name: /pick feb 1 to feb 29/i }));
    fireEvent.click(screen.getByRole("button", { name: /^apply$/i }));

    expect(onChange).toHaveBeenCalledWith({ from: new Date(2024, 1, 1), to: new Date(2024, 1, 29) });
  });

  it("disables Apply until a start date is picked", () => {
    render(<DateRangeFilter value={{ from: undefined, to: undefined }} onChange={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Date Range" }));

    expect(screen.getByRole("button", { name: /^apply$/i })).toBeDisabled();
  });
});
