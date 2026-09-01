"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { buildSearchParamsUrl } from "@/lib/urlSearchParams";
import { getWeeklyTimesheets } from "@/features/timesheets/services/timesheetsApi";
import { TimesheetFilters } from "@/features/timesheets/components/dashboard/TimesheetFilters";
import { TimesheetTable } from "@/features/timesheets/components/dashboard/TimesheetTable";
import { TimesheetTableSkeleton } from "@/features/timesheets/components/dashboard/TimesheetTableSkeleton";
import { Pagination } from "@/components/common/Pagination";
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

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseDateParam(value: string | null): string {
  return value !== null && ISO_DATE_PATTERN.test(value) ? value : "";
}

export function TimesheetDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parsePage(searchParams.get("page"));
  const sortBy = parseSortBy(searchParams.get("sort"));
  const sortDir = parseSortDir(searchParams.get("order"));
  const status = parseStatus(searchParams.get("status"));
  const from = parseDateParam(searchParams.get("from"));
  const to = parseDateParam(searchParams.get("to"));

  const [pageSize, setPageSize] = useState(5);

  const { data, loading, error, refetch } = useFetch(
    () =>
      getWeeklyTimesheets({
        status: status || undefined,
        from: from || undefined,
        to: to || undefined,
        sortBy,
        sortDir,
        page,
        pageSize,
      }),
    [status, from, to, sortBy, sortDir, page, pageSize],
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

  function handleDateRangeChange(nextFrom: string, nextTo: string) {
    navigate({ from: nextFrom || null, to: nextTo || null, page: null }, "push");
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
            from={from}
            to={to}
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
