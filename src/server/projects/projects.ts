import type { Project } from "@/features/timesheets/types/timesheet";

export const PROJECTS: Project[] = [
  { id: "project-1", name: "Client Website Redesign" },
  { id: "project-2", name: "Mobile App" },
  { id: "project-3", name: "Internal Tools" },
  { id: "project-4", name: "Marketing Site" },
];

export function findProjectById(projectId: string): Project | undefined {
  return PROJECTS.find((project) => project.id === projectId);
}
