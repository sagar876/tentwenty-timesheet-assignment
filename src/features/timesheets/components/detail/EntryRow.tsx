import { Badge } from "@/components/ui/badge";
import { EntryActions } from "@/features/timesheets/components/detail/EntryActions";
import type { TimesheetEntry } from "@/features/timesheets/types/timesheet";

interface EntryRowProps {
  entry: TimesheetEntry;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}

export function EntryRow({ entry, onEdit, onDelete }: EntryRowProps) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-sm text-gray-900">{entry.description}</span>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-gray-500">{entry.hours} hrs</span>
        <Badge variant="outline" className="rounded-md border-transparent bg-indigo-50 font-medium text-indigo-700">
          {entry.projectName}
        </Badge>
        <EntryActions entryDescription={entry.description} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}
