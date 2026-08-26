import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders the label for each status", () => {
    const { rerender } = render(<StatusBadge status="completed" />);
    expect(screen.getByText("Completed")).toBeInTheDocument();

    rerender(<StatusBadge status="incomplete" />);
    expect(screen.getByText("Incomplete")).toBeInTheDocument();

    rerender(<StatusBadge status="missing" />);
    expect(screen.getByText("Missing")).toBeInTheDocument();
  });
});
