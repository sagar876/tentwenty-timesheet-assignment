"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { buildSearchParamsUrl } from "@/lib/urlSearchParams";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Only needed to preserve which day's "Add new task" button was clicked; the
  // URL (?modal=add) doesn't carry the day, so a cold refresh/deep-link falls
  // back to the week's start date instead - see modalState below.
  const [pendingAddDate, setPendingAddDate] = useState<string | null>(null);

  const { data, loading, error, refetch } = useFetch(() => getTimesheetEntries(weekId), [weekId]);

  const modalParam = searchParams.get("modal");
  const entryIdParam = searchParams.get("entryId");

  let modalState: ModalState = null;
  if (data) {
    if (modalParam === "add") {
      modalState = { mode: "create", date: pendingAddDate ?? data.week.startDate };
    } else if (modalParam === "edit" && entryIdParam) {
      const entry = data.entries.find((item) => item.id === entryIdParam);
      if (entry) modalState = { mode: "edit", entry };
    }
  }

  function closeModal() {
    router.replace(buildSearchParamsUrl(pathname, searchParams, { modal: null, entryId: null }), {
      scroll: false,
    });
  }

  function openAddModal(date: string) {
    setPendingAddDate(date);
    router.push(buildSearchParamsUrl(pathname, searchParams, { modal: "add", entryId: null }), {
      scroll: false,
    });
  }

  function openEditModal(entry: TimesheetEntry) {
    router.push(buildSearchParamsUrl(pathname, searchParams, { modal: "edit", entryId: entry.id }), {
      scroll: false,
    });
  }

  async function handleModalSubmit(values: EntryInput) {
    if (modalState?.mode === "edit") {
      await updateTimesheet(weekId, modalState.entry.id, values);
    } else {
      await createTimesheet(weekId, values);
    }
    closeModal();
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
                onAddEntry={() => openAddModal(date)}
                onEditEntry={openEditModal}
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
          onClose={closeModal}
          onSubmit={handleModalSubmit}
        />
      )}
    </section>
  );
}
