import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDayLabel } from "@/features/timesheets/utils/format";
import { EntryRow } from "@/features/timesheets/components/detail/EntryRow";
import type { TimesheetEntry } from "@/features/timesheets/types/timesheet";

interface DayEntryGroupProps {
  date: string;
  entries: TimesheetEntry[];
  onAddEntry: () => void;
  onEditEntry: (entry: TimesheetEntry) => void;
  onDeleteEntry: (entry: TimesheetEntry) => Promise<void>;
}

export function DayEntryGroup({
  date,
  entries,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
}: DayEntryGroupProps) {
  return (
    <div className="grid grid-cols-[70px_1fr] gap-4 px-6 py-4 sm:grid-cols-[100px_1fr]">
      <p className="pt-2 text-sm font-bold text-gray-900">{formatDayLabel(date)}</p>
      <div className="space-y-2">
        {entries.map((entry) => (
          <EntryRow
            key={entry.id}
            entry={entry}
            onEdit={() => onEditEntry(entry)}
            onDelete={() => onDeleteEntry(entry)}
          />
        ))}
        <Button
          type="button"
          variant="ghost"
          onClick={onAddEntry}
          className="h-auto w-full justify-center gap-1 rounded-md border border-dashed border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add new task
        </Button>
      </div>
    </div>
  );
}
