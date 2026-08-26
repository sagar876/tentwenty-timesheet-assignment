"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InfoTooltip } from "@/features/timesheets/components/detail/InfoTooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useFetch";
import { getProjects } from "@/features/timesheets/services/projectsApi";
import {
  entrySchema,
  HOURS_MAX,
  HOURS_MIN,
  HOURS_STEP,
  type EntryInput,
} from "@/features/timesheets/schemas/entrySchema";
import { TYPE_OF_WORK_OPTIONS, type TimesheetEntry, type TypeOfWork } from "@/features/timesheets/types/timesheet";

const ERROR_TEXT_CLASSES = "text-sm text-red-600";

interface EntryModalProps {
  date: string;
  entry?: TimesheetEntry;
  onClose: () => void;
  onSubmit: (values: EntryInput) => Promise<void>;
}

export function EntryModal({ date, entry, onClose, onSubmit }: EntryModalProps) {
  const isEditMode = Boolean(entry);

  const { data: projects, error: projectsError } = useFetch(() => getProjects(), []);

  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EntryInput>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      date,
      projectId: entry?.projectId ?? "",
      typeOfWork: (entry?.typeOfWork as TypeOfWork | undefined) ?? TYPE_OF_WORK_OPTIONS[0],
      description: entry?.description ?? "",
      hours: entry?.hours ?? 1,
    },
  });

  const hours = watch("hours");

  function adjustHours(delta: number) {
    const next = Math.min(HOURS_MAX, Math.max(HOURS_MIN, (getValues("hours") || 0) + delta));
    setValue("hours", next, { shouldValidate: true });
  }

  async function handleFormSubmit(values: EntryInput) {
    try {
      await onSubmit(values);
    } catch (error) {
      setError("root", {
        message: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next && !isSubmitting) onClose();
      }}
    >
      <DialogContent showCloseButton={false} className="max-w-md p-0 sm:max-w-md">
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <DialogHeader className="flex-row items-center justify-between gap-2 space-y-0 border-b border-gray-200 px-6 py-4">
            <DialogTitle className="text-lg font-bold text-gray-900">
              {isEditMode ? "Edit Entry" : "Add New Entry"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {isEditMode
                ? "Edit this timesheet entry's project, type of work, description, and hours."
                : "Add a new timesheet entry with a project, type of work, description, and hours."}
            </DialogDescription>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={isSubmitting}
                aria-label="Close"
              >
                <XIcon aria-hidden="true" />
              </Button>
            </DialogClose>
          </DialogHeader>

          <div className="space-y-4 px-6 py-4">
            {errors.root && (
              <p role="alert" className={ERROR_TEXT_CLASSES}>
                {errors.root.message}
              </p>
            )}

            <div className="space-y-1">
              <Label
                htmlFor="projectId"
                className="flex items-center gap-1 text-sm font-medium text-gray-900"
              >
                Select Project
                <InfoTooltip label="More information about selecting a project" />
              </Label>
              <Controller
                control={control}
                name="projectId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="projectId"
                      aria-invalid={errors.projectId ? "true" : "false"}
                      aria-describedby={errors.projectId ? "projectId-error" : undefined}
                      className="h-auto w-full rounded-md border-gray-300 px-3 py-2 text-sm"
                    >
                      <SelectValue placeholder="Project Name" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects?.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.projectId && (
                <p id="projectId-error" className={ERROR_TEXT_CLASSES}>
                  {errors.projectId.message}
                </p>
              )}
              {projectsError && (
                <p className={ERROR_TEXT_CLASSES}>Could not load projects: {projectsError}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="typeOfWork"
                className="flex items-center gap-1 text-sm font-medium text-gray-900"
              >
                Type of Work
                <InfoTooltip label="More information about type of work" />
              </Label>
              <Controller
                control={control}
                name="typeOfWork"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="typeOfWork"
                      aria-invalid={errors.typeOfWork ? "true" : "false"}
                      aria-describedby={errors.typeOfWork ? "typeOfWork-error" : undefined}
                      className="h-auto w-full rounded-md border-gray-300 px-3 py-2 text-sm"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPE_OF_WORK_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.typeOfWork && (
                <p id="typeOfWork-error" className={ERROR_TEXT_CLASSES}>
                  {errors.typeOfWork.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="description" className="text-sm font-medium text-gray-900">
                Task description
              </Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Write text here ..."
                aria-invalid={errors.description ? "true" : "false"}
                aria-describedby={
                  errors.description ? "description-hint description-error" : "description-hint"
                }
                className="min-h-24 rounded-md border-gray-300 px-3 py-2 text-sm"
                {...register("description")}
              />
              <p id="description-hint" className="text-xs text-gray-500">
                A note for extra info
              </p>
              {errors.description && (
                <p id="description-error" className={ERROR_TEXT_CLASSES}>
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="hours" className="text-sm font-medium text-gray-900">
                Hours
              </Label>
              <div className="flex w-fit items-stretch overflow-hidden rounded-md border border-gray-300">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => adjustHours(-1)}
                  disabled={hours <= HOURS_MIN}
                  aria-label="Decrease hours"
                  className="h-auto rounded-none px-3"
                >
                  −
                </Button>
                <input
                  id="hours"
                  type="number"
                  min={HOURS_MIN}
                  max={HOURS_MAX}
                  step={HOURS_STEP}
                  inputMode="decimal"
                  aria-invalid={errors.hours ? "true" : "false"}
                  aria-describedby={errors.hours ? "hours-error" : undefined}
                  className="w-16 border-x border-gray-300 text-center text-sm text-gray-900 focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-indigo-500"
                  {...register("hours", { valueAsNumber: true })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => adjustHours(1)}
                  disabled={hours >= HOURS_MAX}
                  aria-label="Increase hours"
                  className="h-auto rounded-none px-3"
                >
                  +
                </Button>
              </div>
              {errors.hours && (
                <p id="hours-error" className={ERROR_TEXT_CLASSES}>
                  {errors.hours.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
            <Button type="submit" disabled={isSubmitting} className="h-auto px-4 py-2">
              {isSubmitting ? "Saving…" : isEditMode ? "Save changes" : "Add entry"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting} className="h-auto px-4 py-2">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
