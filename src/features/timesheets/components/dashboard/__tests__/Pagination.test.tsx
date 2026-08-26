import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "../Pagination";

describe("Pagination", () => {
  it("disables Previous on the first page and Next on the last page", () => {
    render(
      <Pagination page={1} pageSize={5} total={10} onPageChange={jest.fn()} onPageSizeChange={jest.fn()} />,
    );

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).not.toBeDisabled();
  });

  it("marks the current page with aria-current", () => {
    render(
      <Pagination page={2} pageSize={5} total={10} onPageChange={jest.fn()} onPageSizeChange={jest.fn()} />,
    );

    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page");
  });

  it("calls onPageChange when a page number is clicked", () => {
    const onPageChange = jest.fn();
    render(
      <Pagination page={1} pageSize={5} total={10} onPageChange={onPageChange} onPageSizeChange={jest.fn()} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "2" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageSizeChange when a page size option is chosen", async () => {
    const onPageSizeChange = jest.fn();
    render(
      <Pagination page={1} pageSize={5} total={10} onPageChange={jest.fn()} onPageSizeChange={onPageSizeChange} />,
    );

    fireEvent.click(screen.getByRole("combobox", { name: /rows per page/i }));
    fireEvent.click(await screen.findByRole("option", { name: "10 per page" }));

    expect(onPageSizeChange).toHaveBeenCalledWith(10);
  });

  describe("with many pages", () => {
    it("shows a leading run of pages, an ellipsis, and the last page", () => {
      render(
        <Pagination
          page={3}
          pageSize={5}
          total={495}
          onPageChange={jest.fn()}
          onPageSizeChange={jest.fn()}
        />,
      );

      // Page 3 with a sibling window of 5 covers 1-8, leaving a gap before 99.
      for (const pageNumber of [1, 2, 3, 4, 5, 6, 7, 8, 99]) {
        expect(screen.getByRole("button", { name: String(pageNumber) })).toBeInTheDocument();
      }
      expect(screen.queryByRole("button", { name: "9" })).not.toBeInTheDocument();
      expect(screen.getByText("…")).toBeInTheDocument();
    });

    it("does not turn the ellipsis into a clickable button", () => {
      render(
        <Pagination
          page={3}
          pageSize={5}
          total={495}
          onPageChange={jest.fn()}
          onPageSizeChange={jest.fn()}
        />,
      );

      expect(screen.queryByRole("button", { name: "…" })).not.toBeInTheDocument();
    });

    it("shows an ellipsis before and after the current page when it is in the middle", () => {
      render(
        <Pagination
          page={50}
          pageSize={5}
          total={495}
          onPageChange={jest.fn()}
          onPageSizeChange={jest.fn()}
        />,
      );

      expect(screen.getAllByText("…")).toHaveLength(2);
      expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "99" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "50" })).toHaveAttribute("aria-current", "page");
      expect(screen.queryByRole("button", { name: "44" })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "45" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "55" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "56" })).not.toBeInTheDocument();
    });
  });
});
