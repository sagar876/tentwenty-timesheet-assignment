import type { TimesheetEntry } from "@/features/timesheets/types/timesheet";

let nextEntryId = 1;

function entry(
  weekId: string,
  date: string,
  projectId: string,
  projectName: string,
  typeOfWork: string,
  description: string,
  hours: number,
): TimesheetEntry {
  return {
    id: `entry-${nextEntryId++}`,
    weekId,
    date,
    projectId,
    projectName,
    typeOfWork,
    description,
    hours,
  };
}

const entries: TimesheetEntry[] = [
  entry("week-1", "2024-01-01", "project-1", "Client Website Redesign", "Feature development", "Build homepage hero section", 8),
  entry("week-1", "2024-01-02", "project-1", "Client Website Redesign", "Feature development", "Implement responsive navigation", 8),
  entry("week-1", "2024-01-03", "project-2", "Mobile App", "Bug fixes", "Fix login crash on Android", 8),
  entry("week-1", "2024-01-04", "project-2", "Mobile App", "Testing", "Write unit tests for auth flow", 8),
  entry("week-1", "2024-01-05", "project-3", "Internal Tools", "Documentation", "Update onboarding docs", 8),

  entry("week-2", "2024-01-08", "project-1", "Client Website Redesign", "Code review", "Review PR for checkout flow", 6),
  entry("week-2", "2024-01-08", "project-1", "Client Website Redesign", "Feature development", "Add product filtering", 2),
  entry("week-2", "2024-01-09", "project-2", "Mobile App", "Feature development", "Implement push notifications", 8),
  entry("week-2", "2024-01-10", "project-3", "Internal Tools", "Bug fixes", "Fix broken CSV export", 8),
  entry("week-2", "2024-01-11", "project-4", "Marketing Site", "Feature development", "Build pricing page", 8),
  entry("week-2", "2024-01-12", "project-4", "Marketing Site", "Testing", "Cross-browser QA pass", 8),

  entry("week-3", "2024-01-15", "project-1", "Client Website Redesign", "Bug fixes", "Fix cart total rounding error", 8),
  entry("week-3", "2024-01-16", "project-2", "Mobile App", "Meeting", "Sprint planning and estimation", 8),
  entry("week-3", "2024-01-17", "project-2", "Mobile App", "Feature development", "Add biometric login", 8),

  entry("week-4", "2024-01-22", "project-1", "Client Website Redesign", "Feature development", "Homepage development", 4),
  entry("week-4", "2024-01-22", "project-1", "Client Website Redesign", "Feature development", "Homepage development", 4),
  entry("week-4", "2024-01-23", "project-1", "Client Website Redesign", "Feature development", "Homepage development", 4),
  entry("week-4", "2024-01-23", "project-3", "Internal Tools", "Testing", "Regression testing", 4),
  entry("week-4", "2024-01-23", "project-4", "Marketing Site", "Bug fixes", "Fix footer alignment", 4),
  entry("week-4", "2024-01-24", "project-1", "Client Website Redesign", "Feature development", "Homepage development", 4),
  entry("week-4", "2024-01-24", "project-2", "Mobile App", "Code review", "Review onboarding PR", 4),
  entry("week-4", "2024-01-24", "project-3", "Internal Tools", "Documentation", "Update API docs", 4),
  entry("week-4", "2024-01-25", "project-4", "Marketing Site", "Feature development", "Build newsletter signup", 4),
  entry("week-4", "2024-01-26", "project-2", "Mobile App", "Testing", "Manual QA on release candidate", 4),

  entry("week-6", "2024-02-05", "project-3", "Internal Tools", "Feature development", "Build audit log viewer", 8),
  entry("week-6", "2024-02-06", "project-3", "Internal Tools", "Feature development", "Add filtering to audit log", 8),
  entry("week-6", "2024-02-07", "project-1", "Client Website Redesign", "Meeting", "Design review with stakeholders", 8),
  entry("week-6", "2024-02-08", "project-2", "Mobile App", "Bug fixes", "Fix crash on tablet layout", 8),

  entry("week-7", "2024-02-12", "project-4", "Marketing Site", "Feature development", "Build blog listing page", 8),
  entry("week-7", "2024-02-13", "project-4", "Marketing Site", "Feature development", "Build blog post template", 8),
  entry("week-7", "2024-02-14", "project-1", "Client Website Redesign", "Bug fixes", "Fix mobile menu overlap", 8),
  entry("week-7", "2024-02-15", "project-2", "Mobile App", "Code review", "Review payments module PR", 8),
  entry("week-7", "2024-02-16", "project-3", "Internal Tools", "Testing", "Write integration tests", 8),

  entry("week-9", "2024-02-26", "project-1", "Client Website Redesign", "Feature development", "Implement search autocomplete", 8),
  entry("week-9", "2024-02-27", "project-2", "Mobile App", "Meeting", "Retro and planning", 8),

  entry("week-10", "2024-03-04", "project-3", "Internal Tools", "Feature development", "Build user permissions screen", 8),
  entry("week-10", "2024-03-05", "project-3", "Internal Tools", "Feature development", "Wire up permissions API", 8),
  entry("week-10", "2024-03-06", "project-4", "Marketing Site", "Bug fixes", "Fix contact form validation", 8),
  entry("week-10", "2024-03-07", "project-1", "Client Website Redesign", "Testing", "End-to-end checkout testing", 8),
  entry("week-10", "2024-03-08", "project-2", "Mobile App", "Documentation", "Write release notes", 8),
];

export function getEntriesForWeek(weekId: string): TimesheetEntry[] {
  return entries
    .filter((item) => item.weekId === weekId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function findEntryById(entryId: string): TimesheetEntry | undefined {
  return entries.find((item) => item.id === entryId);
}

export function addEntry(input: Omit<TimesheetEntry, "id">): TimesheetEntry {
  const created: TimesheetEntry = { ...input, id: `entry-${nextEntryId++}` };
  entries.push(created);
  return created;
}

export function updateEntry(
  entryId: string,
  updates: Omit<TimesheetEntry, "id" | "weekId">,
): TimesheetEntry | undefined {
  const index = entries.findIndex((item) => item.id === entryId);
  if (index === -1) return undefined;

  const existing = entries[index]!;
  const updated: TimesheetEntry = { ...existing, ...updates };
  entries[index] = updated;
  return updated;
}

export function deleteEntry(entryId: string): boolean {
  const index = entries.findIndex((item) => item.id === entryId);
  if (index === -1) return false;
  entries.splice(index, 1);
  return true;
}
