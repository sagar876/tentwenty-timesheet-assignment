"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/lib/hooks/useFetch";
import { getWeeklyTimesheets } from "@/features/timesheets/services/timesheetsApi";
import { TimesheetFilters, DATE_RANGE_OPTIONS } from "@/features/timesheets/components/dashboard/TimesheetFilters";
import { TimesheetTable } from "@/features/timesheets/components/dashboard/TimesheetTable";
import { Pagination } from "@/features/timesheets/components/dashboard/Pagination";
import type { SortDirection, TimesheetStatus, WeekSortField } from "@/features/timesheets/types/timesheet";

export function TimesheetDashboard() {
  const [status, setStatus] = useState<TimesheetStatus | "">("");
  const [dateRangeIndex, setDateRangeIndex] = useState(0);
  const [sortBy, setSortBy] = useState<WeekSortField>("weekNumber");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
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

  function handleSortChange(field: WeekSortField) {
    if (field === sortBy) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  }

  function handleStatusChange(next: TimesheetStatus | "") {
    setStatus(next);
    setPage(1);
  }

  function handleDateRangeChange(index: number) {
    setDateRangeIndex(index);
    setPage(1);
  }

  function handlePageSizeChange(next: number) {
    setPageSize(next);
    setPage(1);
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
        {loading && (
          <p className="px-6 py-12 text-center text-sm text-gray-500">Loading timesheets…</p>
        )}

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
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>
    </section>
  );
}
