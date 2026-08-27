import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { createEntry } from "@/server/timesheets/timesheetService";
import { entrySchema } from "@/features/timesheets/schemas/entrySchema";

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/timesheets/[weekId]/entries">,
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { weekId } = await ctx.params;
    const body = await request.json();
    const parsed = entrySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const result = createEntry(weekId, parsed.data);
    if (!result.ok) {
      if (result.reason === "exceeds_weekly_limit") {
        return NextResponse.json({ error: "Weekly hours cannot exceed 40 hours." }, { status: 400 });
      }
      const message =
        result.reason === "week_not_found"
          ? `Week not found: ${weekId}`
          : `Project not found: ${parsed.data.projectId}`;
      return NextResponse.json({ error: message }, { status: 404 });
    }

    return NextResponse.json(result.entry, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
