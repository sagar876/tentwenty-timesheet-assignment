import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TimesheetStatus } from "@/features/timesheets/types/timesheet";

interface DateRangeOption {
  label: string;
  from?: string;
  to?: string;
}

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { label: "All dates" },
  { label: "January 2024", from: "2024-01-01", to: "2024-01-31" },
  { label: "February 2024", from: "2024-02-01", to: "2024-02-29" },
  { label: "March 2024", from: "2024-03-01", to: "2024-03-31" },
];

const STATUS_OPTIONS: { label: string; value: TimesheetStatus | "all" }[] = [
  { label: "All statuses", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Incomplete", value: "incomplete" },
  { label: "Missing", value: "missing" },
];

const SELECT_TRIGGER_CLASSES =
  "h-auto rounded-md border-gray-300 px-3 py-2 text-sm text-gray-700";

interface TimesheetFiltersProps {
  dateRangeIndex: number;
  onDateRangeChange: (index: number) => void;
  status: TimesheetStatus | "";
  onStatusChange: (status: TimesheetStatus | "") => void;
}

export function TimesheetFilters({
  dateRangeIndex,
  onDateRangeChange,
  status,
  onStatusChange,
}: TimesheetFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div>
        <Label htmlFor="date-range-filter" className="sr-only">
          Date range
        </Label>
        <Select
          value={String(dateRangeIndex)}
          onValueChange={(value) => onDateRangeChange(Number(value))}
        >
          <SelectTrigger id="date-range-filter" className={SELECT_TRIGGER_CLASSES}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGE_OPTIONS.map((option, index) => (
              <SelectItem key={option.label} value={String(index)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status-filter" className="sr-only">
          Status
        </Label>
        <Select
          value={status || "all"}
          onValueChange={(value) => onStatusChange(value === "all" ? "" : (value as TimesheetStatus))}
        >
          <SelectTrigger id="status-filter" className={SELECT_TRIGGER_CLASSES}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.label} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
