"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatTriggerLabel(value: DateRange, placeholder: string): string {
  if (value.from && value.to) {
    return `${LABEL_FORMATTER.format(value.from)} - ${LABEL_FORMATTER.format(value.to)}`;
  }
  if (value.from) return `${LABEL_FORMATTER.format(value.from)} - ...`;
  return placeholder;
}

// Year dropdown navigation needs bounds, computed from "now" rather than a
// fixed year so the default range keeps making sense as time passes.
const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_START_MONTH = new Date(CURRENT_YEAR - 20, 0, 1);
const DEFAULT_END_MONTH = new Date(CURRENT_YEAR, 11, 31);

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  placeholder?: string;
  ariaLabel?: string;
  startMonth?: Date;
  endMonth?: Date;
}

export function DateRangeFilter({
  value,
  onChange,
  placeholder = "Date Range",
  ariaLabel = placeholder,
  startMonth = DEFAULT_START_MONTH,
  endMonth = DEFAULT_END_MONTH,
}: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<DateRange>(value);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) setPending(value);
    setOpen(nextOpen);
  }

  function handleApply() {
    onChange(pending);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={ariaLabel}
          className="h-auto justify-start rounded-md border-gray-300 px-3 py-2 text-sm font-normal text-gray-700"
        >
          {formatTriggerLabel(value, placeholder)}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          selected={pending}
          onSelect={(range) => setPending(range ?? { from: undefined, to: undefined })}
          defaultMonth={pending.from}
          captionLayout="dropdown"
          startMonth={startMonth}
          endMonth={endMonth}
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
