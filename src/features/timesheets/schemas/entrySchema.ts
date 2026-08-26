import { z } from "zod";
import { TYPE_OF_WORK_OPTIONS } from "@/features/timesheets/types/timesheet";

export const HOURS_STEP = 0.25;
export const HOURS_MIN = HOURS_STEP;
export const HOURS_MAX = 24;

export const entrySchema = z.object({
  date: z.string().min(1, "Date is required"),
  projectId: z.string().min(1, "Project is required"),
  typeOfWork: z.enum(TYPE_OF_WORK_OPTIONS, {
    error: "Type of work is required",
  }),
  description: z.string().min(1, "Task description is required"),
  hours: z
    .number({ error: "Hours is required" })
    .positive("Hours must be greater than 0")
    .max(HOURS_MAX, "Hours can't exceed 24 for a single entry")
    .refine((value) => Math.round(value / HOURS_STEP) * HOURS_STEP === value, {
      message: "Hours must be in increments of 0.25",
    }),
});

export type EntryInput = z.infer<typeof entrySchema>;
