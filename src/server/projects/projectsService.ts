import type { Project } from "@/features/timesheets/types/timesheet";
import { PROJECTS } from "@/server/projects/projects";

export function getProjects(): Project[] {
  return PROJECTS;
}
