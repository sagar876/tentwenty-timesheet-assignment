const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", { month: "long" });

export function formatDateRange(startIso: string, endIso: string): string {
  const start = new Date(`${startIso}T00:00:00`);
  const end = new Date(`${endIso}T00:00:00`);
  const year = end.getFullYear();

  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} - ${end.getDate()} ${MONTH_FORMATTER.format(end)}, ${year}`;
  }

  return `${start.getDate()} ${MONTH_FORMATTER.format(start)} - ${end.getDate()} ${MONTH_FORMATTER.format(end)}, ${year}`;
}

const DAY_LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export function formatDayLabel(dateIso: string): string {
  return DAY_LABEL_FORMATTER.format(new Date(`${dateIso}T00:00:00`));
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDatesInRange(startIso: string, endIso: string): string[] {
  const dates: string[] = [];
  const cursor = new Date(`${startIso}T00:00:00`);
  const end = new Date(`${endIso}T00:00:00`);

  while (cursor <= end) {
    dates.push(toIsoDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}
