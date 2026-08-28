import { z } from "zod";
import { TYPE_OF_WORK_OPTIONS } from "@/features/timesheets/types/timesheet";

export const HOURS_MIN = 0.01;
export const HOURS_MAX = 8;

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
    .max(HOURS_MAX, "Hours can't exceed 8 for a single entry")
    .refine((value) => Number(value.toFixed(2)) === value, {
      message: "Hours can have at most 2 decimal places",
    }),
});

export type EntryInput = z.infer<typeof entrySchema>;
