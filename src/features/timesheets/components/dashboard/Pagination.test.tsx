import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "./Pagination";

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
});
