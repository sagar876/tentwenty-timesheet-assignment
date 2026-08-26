"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/lib/hooks/useFetch";
import {
  getTimesheetEntries,
  createTimesheet,
  updateTimesheet,
  deleteTimesheet,
} from "@/features/timesheets/services/timesheetsApi";
import { getDatesInRange } from "@/features/timesheets/utils/format";
import { WeekProgressHeader } from "@/features/timesheets/components/detail/WeekProgressHeader";
import { DayEntryGroup } from "@/features/timesheets/components/detail/DayEntryGroup";
import { EntryModal } from "@/features/timesheets/components/detail/EntryModal";
import type { TimesheetEntry } from "@/features/timesheets/types/timesheet";
import type { EntryInput } from "@/features/timesheets/schemas/entrySchema";

interface WeekDetailViewProps {
  weekId: string;
}

type ModalState = { mode: "create"; date: string } | { mode: "edit"; entry: TimesheetEntry } | null;

export function WeekDetailView({ weekId }: WeekDetailViewProps) {
  const [modalState, setModalState] = useState<ModalState>(null);

  const { data, loading, error, refetch } = useFetch(() => getTimesheetEntries(weekId), [weekId]);

  async function handleModalSubmit(values: EntryInput) {
    if (modalState?.mode === "edit") {
      await updateTimesheet(weekId, modalState.entry.id, values);
    } else {
      await createTimesheet(weekId, values);
    }
    setModalState(null);
    refetch();
  }

  async function handleEntryDelete(entry: TimesheetEntry) {
    await deleteTimesheet(weekId, entry.id);
    refetch();
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {loading && (
        <p className="px-6 py-12 text-center text-sm text-gray-500">Loading timesheet…</p>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <Button type="button" variant="outline" onClick={refetch} className="h-auto px-4 py-2">
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && data && (
        <>
          <WeekProgressHeader week={data.week} />
          <div className="divide-y divide-gray-200">
            {getDatesInRange(data.week.startDate, data.week.endDate).map((date) => (
              <DayEntryGroup
                key={date}
                date={date}
                entries={data.entries.filter((entry) => entry.date === date)}
                onAddEntry={() => setModalState({ mode: "create", date })}
                onEditEntry={(entry) => setModalState({ mode: "edit", entry })}
                onDeleteEntry={handleEntryDelete}
              />
            ))}
          </div>
        </>
      )}

      {modalState && (
        <EntryModal
          date={modalState.mode === "edit" ? modalState.entry.date : modalState.date}
          entry={modalState.mode === "edit" ? modalState.entry : undefined}
          onClose={() => setModalState(null)}
          onSubmit={handleModalSubmit}
        />
      )}
    </section>
  );
}
