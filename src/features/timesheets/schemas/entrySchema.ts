import { z } from "zod";
import { TYPE_OF_WORK_OPTIONS } from "@/features/timesheets/types/timesheet";

export const entrySchema = z.object({
  date: z.string().min(1, "Date is required"),
  projectId: z.string().min(1, "Project is required"),
  typeOfWork: z.enum(TYPE_OF_WORK_OPTIONS, {
    error: "Type of work is required",
  }),
  description: z.string().min(1, "Task description is required"),
  hours: z
    .number()
    .int("Hours must be a whole number")
    .min(1, "Hours must be at least 1")
    .max(24, "Hours can't exceed 24 for a single entry"),
});

export type EntryInput = z.infer<typeof entrySchema>;
