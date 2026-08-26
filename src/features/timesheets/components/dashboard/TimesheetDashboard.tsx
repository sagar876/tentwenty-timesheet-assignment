"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { buildSearchParamsUrl } from "@/hooks/urlSearchParams";
import { getWeeklyTimesheets } from "@/features/timesheets/services/timesheetsApi";
import { TimesheetFilters, DATE_RANGE_OPTIONS } from "@/features/timesheets/components/dashboard/TimesheetFilters";
import { TimesheetTable } from "@/features/timesheets/components/dashboard/TimesheetTable";
import { TimesheetTableSkeleton } from "@/features/timesheets/components/dashboard/TimesheetTableSkeleton";
import { Pagination } from "@/features/timesheets/components/dashboard/Pagination";
import type { SortDirection, TimesheetStatus, WeekSortField } from "@/features/timesheets/types/timesheet";

const VALID_SORT_FIELDS: WeekSortField[] = ["weekNumber", "startDate", "status"];
const DEFAULT_SORT_FIELD: WeekSortField = "weekNumber";
const DEFAULT_SORT_DIR: SortDirection = "asc";
const VALID_STATUSES: TimesheetStatus[] = ["completed", "incomplete", "missing"];

function parsePage(value: string | null): number {
  const parsed = value === null ? NaN : Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return 1;
  return parsed;
}

function parseSortBy(value: string | null): WeekSortField {
  return (VALID_SORT_FIELDS as string[]).includes(value ?? "")
    ? (value as WeekSortField)
    : DEFAULT_SORT_FIELD;
}

function parseSortDir(value: string | null): SortDirection {
  return value === "desc" ? "desc" : DEFAULT_SORT_DIR;
}

function parseStatus(value: string | null): TimesheetStatus | "" {
  return value !== null && (VALID_STATUSES as string[]).includes(value) ? (value as TimesheetStatus) : "";
}

// The URL uses each date range's own "from" month (e.g. "2024-01") rather than
// its array index, so the value is stable/meaningful instead of arbitrary.
function dateRangeIndexToParam(index: number): string | null {
  const from = DATE_RANGE_OPTIONS[index]?.from;
  return from ? from.slice(0, 7) : null;
}

function parseDateRangeIndex(value: string | null): number {
  if (!value) return 0;
  const index = DATE_RANGE_OPTIONS.findIndex((option) => option.from?.slice(0, 7) === value);
  return index === -1 ? 0 : index;
}

export function TimesheetDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parsePage(searchParams.get("page"));
  const sortBy = parseSortBy(searchParams.get("sort"));
  const sortDir = parseSortDir(searchParams.get("order"));
  const status = parseStatus(searchParams.get("status"));
  const dateRangeIndex = parseDateRangeIndex(searchParams.get("dateRange"));

  const [pageSize, setPageSize] = useState(5);

  const dateRange = DATE_RANGE_OPTIONS[dateRangeIndex]!;

  const { data, loading, error, refetch } = useFetch(
    () =>
      getWeeklyTimesheets({
        status: status || undefined,
        from: dateRange.from,
        to: dateRange.to,
        sortBy,
        sortDir,
        page,
        pageSize,
      }),
    [status, dateRange.from, dateRange.to, sortBy, sortDir, page, pageSize],
  );

  function navigate(updates: Record<string, string | null>, mode: "push" | "replace") {
    router[mode](buildSearchParamsUrl(pathname, searchParams, updates), { scroll: false });
  }

  function handleSortChange(field: WeekSortField) {
    if (field === sortBy) {
      navigate({ order: sortDir === "asc" ? "desc" : "asc" }, "replace");
    } else {
      navigate({ sort: field, order: "asc" }, "replace");
    }
  }

  function handlePageChange(next: number) {
    const safePage = Math.max(1, next);
    navigate({ page: safePage === 1 ? null : String(safePage) }, "push");
  }

  function handleStatusChange(next: TimesheetStatus | "") {
    navigate({ status: next || null, page: null }, "push");
  }

  function handleDateRangeChange(index: number) {
    navigate({ dateRange: dateRangeIndexToParam(index), page: null }, "push");
  }

  function handlePageSizeChange(next: number) {
    setPageSize(next);
    navigate({ page: null }, "replace");
  }

  return (
    <section
      aria-labelledby="timesheets-heading"
      className="rounded-lg border border-gray-200 bg-white shadow-sm"
    >
      <div className="border-b border-gray-200 px-6 py-6">
        <h1 id="timesheets-heading" className="text-xl font-bold text-gray-900">
          Your Timesheets
        </h1>
        <div className="mt-4">
          <TimesheetFilters
            dateRangeIndex={dateRangeIndex}
            onDateRangeChange={handleDateRangeChange}
            status={status}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      <div aria-live="polite" aria-busy={loading}>
        {loading && <TimesheetTableSkeleton rows={pageSize} />}

        {!loading && error && (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <Button type="button" variant="outline" onClick={refetch} className="h-auto px-4 py-2">
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && data && data.items.length === 0 && (
          <p className="px-6 py-12 text-center text-sm text-gray-500">
            No timesheets found for the selected filters.
          </p>
        )}

        {!loading && !error && data && data.items.length > 0 && (
          <>
            <TimesheetTable
              weeks={data.items}
              sortBy={sortBy}
              sortDir={sortDir}
              onSortChange={handleSortChange}
            />
            <Pagination
              page={data.page}
              pageSize={data.pageSize}
              total={data.total}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>
    </section>
  );
}
