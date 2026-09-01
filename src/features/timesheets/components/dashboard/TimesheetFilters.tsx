import { XIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangeFilter } from "@/components/common/DateRangeFilter";
import { parseIsoDate, toIsoDate } from "@/features/timesheets/utils/format";
import type { TimesheetStatus } from "@/features/timesheets/types/timesheet";

const STATUS_OPTIONS: { label: string; value: TimesheetStatus | "all" }[] = [
  { label: "Status", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Incomplete", value: "incomplete" },
  { label: "Missing", value: "missing" },
];

const SELECT_TRIGGER_CLASSES =
  "h-auto rounded-md border-gray-300 px-3 py-2 text-sm text-gray-700";

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
  function handleDateRangeChange(range: DateRange) {
    onDateRangeChange(range.from ? toIsoDate(range.from) : "", range.to ? toIsoDate(range.to) : "");
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <DateRangeFilter
        value={{ from: parseIsoDate(from), to: parseIsoDate(to) }}
        onChange={handleDateRangeChange}
      />

      {(from || to) && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => onDateRangeChange("", "")}
          className="h-auto w-fit gap-1 self-start px-2 py-2 text-sm text-gray-500 hover:text-gray-700 sm:self-center"
        >
          <XIcon aria-hidden="true" className="h-4 w-4" />
          Clear dates
        </Button>
      )}

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
