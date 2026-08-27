"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDateRange, formatDayLabel, toIsoDate } from "@/features/timesheets/utils/format";

interface DateRangeFilterProps {
  from: string;
  to: string;
  onDateRangeChange: (from: string, to: string) => void;
}

function parseIsoDate(value: string): Date | undefined {
  return value ? new Date(`${value}T00:00:00`) : undefined;
}

function triggerLabel(from: string, to: string): string {
  if (from && to) return formatDateRange(from, to);
  if (from) return `${formatDayLabel(from)} - ...`;
  return "Date Range";
}

// Year dropdown navigation needs bounds, computed from "now" rather than a
// fixed year so the range keeps making sense as time passes.
const CURRENT_YEAR = new Date().getFullYear();
const CALENDAR_START_MONTH = new Date(CURRENT_YEAR - 20, 0, 1);
const CALENDAR_END_MONTH = new Date(CURRENT_YEAR, 11, 31);

export function DateRangeFilter({ from, to, onDateRangeChange }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<DateRange>({ from: parseIsoDate(from), to: parseIsoDate(to) });

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setPending({ from: parseIsoDate(from), to: parseIsoDate(to) });
    }
    setOpen(nextOpen);
  }

  function handleApply() {
    onDateRangeChange(pending.from ? toIsoDate(pending.from) : "", pending.to ? toIsoDate(pending.to) : "");
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label="Date range"
          className="h-auto justify-start rounded-md border-gray-300 px-3 py-2 text-sm font-normal text-gray-700"
        >
          {triggerLabel(from, to)}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          selected={pending}
          onSelect={(range) => setPending(range ?? { from: undefined, to: undefined })}
          defaultMonth={pending.from}
          captionLayout="dropdown"
          startMonth={CALENDAR_START_MONTH}
          endMonth={CALENDAR_END_MONTH}
        />
        <div className="flex justify-end border-t border-gray-200 p-2">
          <Button type="button" onClick={handleApply} disabled={!pending.from} className="h-auto px-4 py-2 text-sm">
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
