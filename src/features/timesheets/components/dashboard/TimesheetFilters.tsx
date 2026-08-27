import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TimesheetStatus } from "@/features/timesheets/types/timesheet";

const STATUS_OPTIONS: { label: string; value: TimesheetStatus | "all" }[] = [
  { label: "Status", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Incomplete", value: "incomplete" },
  { label: "Missing", value: "missing" },
];

const SELECT_TRIGGER_CLASSES =
  "h-auto rounded-md border-gray-300 px-3 py-2 text-sm text-gray-700";
const DATE_INPUT_CLASSES =
  "h-auto rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700";

interface TimesheetFiltersProps {
  from: string;
  to: string;
  onDateRangeChange: (from: string, to: string) => void;
  status: TimesheetStatus | "";
  onStatusChange: (status: TimesheetStatus | "") => void;
}

export function TimesheetFilters({
  from,
  to,
  onDateRangeChange,
  status,
  onStatusChange,
}: TimesheetFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div>
        <Label htmlFor="date-from-filter" className="sr-only">
          Start date
        </Label>
        <input
          id="date-from-filter"
          type="date"
          value={from}
          max={to || undefined}
          onChange={(event) => onDateRangeChange(event.target.value, to)}
          className={DATE_INPUT_CLASSES}
        />
      </div>

      <div>
        <Label htmlFor="date-to-filter" className="sr-only">
          End date
        </Label>
        <input
          id="date-to-filter"
          type="date"
          value={to}
          min={from || undefined}
          onChange={(event) => onDateRangeChange(from, event.target.value)}
          className={DATE_INPUT_CLASSES}
        />
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
