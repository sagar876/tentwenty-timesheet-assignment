import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE_OPTIONS = [5, 10];
const SIBLING_COUNT = 1;

type PageItem = number | "ellipsis";

// Always shows the first and last page, plus a window of SIBLING_COUNT pages
// on either side of the current page, collapsing any gap into a single "...".
function getPageItems(page: number, totalPages: number): PageItem[] {
  const startPage = Math.max(1, page - SIBLING_COUNT);
  const endPage = Math.min(totalPages, page + SIBLING_COUNT);

  const items: PageItem[] = [];
  if (startPage > 1) {
    items.push(1);
    if (startPage > 2) items.push("ellipsis");
  }
  for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
    items.push(pageNumber);
  }
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) items.push("ellipsis");
    items.push(totalPages);
  }
  return items;
}

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <nav
      aria-label="Timesheet pages"
      className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Label htmlFor="page-size" className="sr-only">
          Rows per page
        </Label>
        <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger
            id="page-size"
            size="sm"
            className="h-auto rounded-md border-gray-300 bg-gray-100 px-2 py-1 text-sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto text-sm">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-auto rounded-md px-3 py-1.5 text-gray-600"
        >
          Previous
        </Button>
        {getPageItems(page, totalPages).map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="px-2 py-1.5 text-gray-400 select-none"
            >
              …
            </span>
          ) : (
            <Button
              key={item}
              type="button"
              variant="ghost"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={`h-auto rounded-md px-3 py-1.5 ${
                item === page ? "bg-gray-100 font-semibold text-gray-900" : "text-gray-600"
              }`}
            >
              {item}
            </Button>
          ),
        )}
        <Button
          type="button"
          variant="ghost"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="h-auto rounded-md px-3 py-1.5 text-gray-600"
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
