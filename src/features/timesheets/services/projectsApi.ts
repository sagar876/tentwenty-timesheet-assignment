import { parseJsonOrThrow } from "@/lib/http";
import type { Project } from "@/features/timesheets/types/timesheet";

export async function getProjects(): Promise<Project[]> {
  const response = await fetch("/api/projects");
  return parseJsonOrThrow<Project[]>(response);
}
