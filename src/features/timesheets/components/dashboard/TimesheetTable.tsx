import Link from "next/link";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { formatDateRange } from "@/features/timesheets/utils/format";
import { StatusBadge } from "@/features/timesheets/components/dashboard/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  SortDirection,
  TimesheetStatus,
  WeekSortField,
  WeekSummary,
} from "@/features/timesheets/types/timesheet";

const ACTION_LABEL: Record<TimesheetStatus, string> = {
  completed: "View",
  incomplete: "Update",
  missing: "Create",
};

interface TimesheetTableProps {
  weeks: WeekSummary[];
  sortBy: WeekSortField;
  sortDir: SortDirection;
  onSortChange: (field: WeekSortField) => void;
}

interface SortableHeaderProps {
  field: WeekSortField;
  label: string;
  sortBy: WeekSortField;
  sortDir: SortDirection;
  onSortChange: (field: WeekSortField) => void;
}

function SortableHeader({ field, label, sortBy, sortDir, onSortChange }: SortableHeaderProps) {
  const isActive = sortBy === field;

  return (
    <TableHead className="h-auto px-6 py-3 text-inherit">
      <button
        type="button"
        onClick={() => onSortChange(field)}
        aria-label={`Sort by ${label}${isActive ? `, currently ${sortDir === "asc" ? "ascending" : "descending"}` : ""}`}
        className="-m-2 inline-flex cursor-pointer items-center gap-1 rounded p-2 uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        {label}
        {isActive ? (
          sortDir === "asc" ? (
            <ChevronUp aria-hidden="true" className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
          )
        ) : (
          <ChevronsUpDown aria-hidden="true" className="h-3.5 w-3.5 text-gray-400" />
        )}
      </button>
    </TableHead>
  );
}

export function TimesheetTable({ weeks, sortBy, sortDir, onSortChange }: TimesheetTableProps) {
  return (
    <Table className="min-w-[640px] text-left">
      <TableCaption className="sr-only">Your weekly timesheets</TableCaption>
      <TableHeader className="bg-gray-50 text-xs font-medium tracking-wide text-gray-500 uppercase">
        <TableRow className="hover:bg-gray-50">
          <SortableHeader
            field="weekNumber"
            label="Week #"
            sortBy={sortBy}
            sortDir={sortDir}
            onSortChange={onSortChange}
          />
          <SortableHeader
            field="startDate"
            label="Date"
            sortBy={sortBy}
            sortDir={sortDir}
            onSortChange={onSortChange}
          />
          <SortableHeader
            field="status"
            label="Status"
            sortBy={sortBy}
            sortDir={sortDir}
            onSortChange={onSortChange}
          />
          <TableHead className="h-auto px-6 py-3 text-right text-inherit">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-gray-200">
        {weeks.map((week) => (
          <TableRow key={week.id} className="hover:bg-transparent">
            <TableCell className="bg-gray-50 px-6 py-4 text-gray-900">{week.weekNumber}</TableCell>
            <TableCell className="px-6 py-4 text-gray-600">
              {formatDateRange(week.startDate, week.endDate)}
            </TableCell>
            <TableCell className="px-6 py-4">
              <StatusBadge status={week.status} />
            </TableCell>
            <TableCell className="px-6 py-4 text-right">
              <Link
                href={`/timesheets/${week.id}`}
                className={buttonVariants({
                  variant: "link",
                  className: "-m-2 h-auto p-2 text-indigo-600 hover:text-indigo-700",
                })}
              >
                {ACTION_LABEL[week.status]}
                <span className="sr-only"> timesheet for week {week.weekNumber}</span>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
