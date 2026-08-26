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

  entry("week-11", "2024-03-11", "project-1", "Client Website Redesign", "Feature development", "Implement new dashboard widgets", 16),
  entry("week-11", "2024-03-12", "project-2", "Mobile App", "Code review", "Write integration test coverage", 24),
  entry("week-12", "2024-03-18", "project-2", "Mobile App", "Bug fixes", "Fix intermittent flaky test", 20),
  entry("week-12", "2024-03-19", "project-3", "Internal Tools", "Testing", "Update internal documentation", 20),
  entry("week-13", "2024-03-25", "project-3", "Internal Tools", "Code review", "Review teammate pull request", 24),
  entry("week-13", "2024-03-26", "project-4", "Marketing Site", "Documentation", "Sprint planning and estimation", 16),
  entry("week-14", "2024-04-01", "project-4", "Marketing Site", "Testing", "Write integration test coverage", 16),
  entry("week-14", "2024-04-02", "project-1", "Client Website Redesign", "Meeting", "Refactor shared form components", 24),
  entry("week-15", "2024-04-08", "project-1", "Client Website Redesign", "Documentation", "Update internal documentation", 20),
  entry("week-15", "2024-04-09", "project-2", "Mobile App", "Feature development", "Investigate reported production bug", 20),
  entry("week-16", "2024-04-15", "project-2", "Mobile App", "Meeting", "Sprint planning and estimation", 24),
  entry("week-16", "2024-04-16", "project-3", "Internal Tools", "Bug fixes", "Optimize slow database query", 16),
  entry("week-17", "2024-04-22", "project-3", "Internal Tools", "Feature development", "Refactor shared form components", 16),
  entry("week-17", "2024-04-23", "project-4", "Marketing Site", "Code review", "Polish onboarding flow copy", 24),
  entry("week-18", "2024-04-29", "project-4", "Marketing Site", "Bug fixes", "Investigate reported production bug", 16),
  entry("week-19", "2024-05-06", "project-1", "Client Website Redesign", "Code review", "Optimize slow database query", 20),
  entry("week-21", "2024-05-20", "project-3", "Internal Tools", "Documentation", "Implement new dashboard widgets", 20),
  entry("week-21", "2024-05-21", "project-4", "Marketing Site", "Feature development", "Write integration test coverage", 20),
  entry("week-22", "2024-05-27", "project-4", "Marketing Site", "Meeting", "Fix intermittent flaky test", 24),
  entry("week-22", "2024-05-28", "project-1", "Client Website Redesign", "Bug fixes", "Update internal documentation", 16),
  entry("week-23", "2024-06-03", "project-1", "Client Website Redesign", "Feature development", "Review teammate pull request", 16),
  entry("week-23", "2024-06-04", "project-2", "Mobile App", "Code review", "Sprint planning and estimation", 24),
  entry("week-24", "2024-06-10", "project-2", "Mobile App", "Bug fixes", "Write integration test coverage", 20),
  entry("week-24", "2024-06-11", "project-3", "Internal Tools", "Testing", "Refactor shared form components", 20),
  entry("week-25", "2024-06-17", "project-3", "Internal Tools", "Code review", "Update internal documentation", 24),
  entry("week-25", "2024-06-18", "project-4", "Marketing Site", "Documentation", "Investigate reported production bug", 16),
  entry("week-26", "2024-06-24", "project-4", "Marketing Site", "Testing", "Sprint planning and estimation", 16),
  entry("week-26", "2024-06-25", "project-1", "Client Website Redesign", "Meeting", "Optimize slow database query", 24),
  entry("week-27", "2024-07-01", "project-1", "Client Website Redesign", "Documentation", "Refactor shared form components", 20),
  entry("week-27", "2024-07-02", "project-2", "Mobile App", "Feature development", "Polish onboarding flow copy", 20),
  entry("week-28", "2024-07-08", "project-2", "Mobile App", "Meeting", "Investigate reported production bug", 20),
  entry("week-29", "2024-07-15", "project-3", "Internal Tools", "Feature development", "Optimize slow database query", 12),
  entry("week-31", "2024-07-29", "project-1", "Client Website Redesign", "Code review", "Implement new dashboard widgets", 24),
  entry("week-31", "2024-07-30", "project-2", "Mobile App", "Documentation", "Write integration test coverage", 16),
  entry("week-32", "2024-08-05", "project-2", "Mobile App", "Testing", "Fix intermittent flaky test", 16),
  entry("week-32", "2024-08-06", "project-3", "Internal Tools", "Meeting", "Update internal documentation", 24),
  entry("week-33", "2024-08-12", "project-3", "Internal Tools", "Documentation", "Review teammate pull request", 20),
  entry("week-33", "2024-08-13", "project-4", "Marketing Site", "Feature development", "Sprint planning and estimation", 20),
  entry("week-34", "2024-08-19", "project-4", "Marketing Site", "Meeting", "Write integration test coverage", 24),
  entry("week-34", "2024-08-20", "project-1", "Client Website Redesign", "Bug fixes", "Refactor shared form components", 16),
  entry("week-35", "2024-08-26", "project-1", "Client Website Redesign", "Feature development", "Update internal documentation", 16),
  entry("week-35", "2024-08-27", "project-2", "Mobile App", "Code review", "Investigate reported production bug", 24),
  entry("week-36", "2024-09-02", "project-2", "Mobile App", "Bug fixes", "Sprint planning and estimation", 20),
  entry("week-36", "2024-09-03", "project-3", "Internal Tools", "Testing", "Optimize slow database query", 20),
  entry("week-37", "2024-09-09", "project-3", "Internal Tools", "Code review", "Refactor shared form components", 24),
  entry("week-37", "2024-09-10", "project-4", "Marketing Site", "Documentation", "Polish onboarding flow copy", 16),
  entry("week-38", "2024-09-16", "project-4", "Marketing Site", "Testing", "Investigate reported production bug", 12),
  entry("week-39", "2024-09-23", "project-1", "Client Website Redesign", "Documentation", "Optimize slow database query", 16),
  entry("week-41", "2024-10-07", "project-3", "Internal Tools", "Feature development", "Implement new dashboard widgets", 16),
  entry("week-41", "2024-10-08", "project-4", "Marketing Site", "Code review", "Write integration test coverage", 24),
  entry("week-42", "2024-10-14", "project-4", "Marketing Site", "Bug fixes", "Fix intermittent flaky test", 20),
  entry("week-42", "2024-10-15", "project-1", "Client Website Redesign", "Testing", "Update internal documentation", 20),
  entry("week-43", "2024-10-21", "project-1", "Client Website Redesign", "Code review", "Review teammate pull request", 24),
  entry("week-43", "2024-10-22", "project-2", "Mobile App", "Documentation", "Sprint planning and estimation", 16),
  entry("week-44", "2024-10-28", "project-2", "Mobile App", "Testing", "Write integration test coverage", 16),
  entry("week-44", "2024-10-29", "project-3", "Internal Tools", "Meeting", "Refactor shared form components", 24),
  entry("week-45", "2024-11-04", "project-3", "Internal Tools", "Documentation", "Update internal documentation", 20),
  entry("week-45", "2024-11-05", "project-4", "Marketing Site", "Feature development", "Investigate reported production bug", 20),
  entry("week-46", "2024-11-11", "project-4", "Marketing Site", "Meeting", "Sprint planning and estimation", 24),
  entry("week-46", "2024-11-12", "project-1", "Client Website Redesign", "Bug fixes", "Optimize slow database query", 16),
  entry("week-47", "2024-11-18", "project-1", "Client Website Redesign", "Feature development", "Refactor shared form components", 16),
  entry("week-47", "2024-11-19", "project-2", "Mobile App", "Code review", "Polish onboarding flow copy", 24),
  entry("week-48", "2024-11-25", "project-2", "Mobile App", "Bug fixes", "Investigate reported production bug", 16),
  entry("week-49", "2024-12-02", "project-3", "Internal Tools", "Code review", "Optimize slow database query", 20),
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
