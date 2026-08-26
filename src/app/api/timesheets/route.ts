import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { getWeekSummaries } from "@/server/timesheets/timesheetService";
import type { SortDirection, TimesheetStatus, WeekSortField } from "@/features/timesheets/types/timesheet";

const VALID_STATUSES: TimesheetStatus[] = ["completed", "incomplete", "missing"];
const VALID_SORT_FIELDS: WeekSortField[] = ["weekNumber", "startDate", "status"];
const VALID_SORT_DIRECTIONS: SortDirection[] = ["asc", "desc"];

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;

    const statusParam = searchParams.get("status");
    if (statusParam && !VALID_STATUSES.includes(statusParam as TimesheetStatus)) {
      return NextResponse.json(
        { error: `Invalid status: ${statusParam}` },
        { status: 400 },
      );
    }

    const sortByParam = searchParams.get("sortBy");
    if (sortByParam && !VALID_SORT_FIELDS.includes(sortByParam as WeekSortField)) {
      return NextResponse.json({ error: `Invalid sortBy: ${sortByParam}` }, { status: 400 });
    }

    const sortDirParam = searchParams.get("sortDir");
    if (sortDirParam && !VALID_SORT_DIRECTIONS.includes(sortDirParam as SortDirection)) {
      return NextResponse.json({ error: `Invalid sortDir: ${sortDirParam}` }, { status: 400 });
    }

    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "5");
    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(pageSize) || pageSize < 1) {
      return NextResponse.json(
        { error: "page and pageSize must be positive integers" },
        { status: 400 },
      );
    }

    const result = getWeekSummaries({
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
      status: (statusParam as TimesheetStatus | null) ?? undefined,
      sortBy: (sortByParam as WeekSortField | null) ?? undefined,
      sortDir: (sortDirParam as SortDirection | null) ?? undefined,
      page,
      pageSize,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
