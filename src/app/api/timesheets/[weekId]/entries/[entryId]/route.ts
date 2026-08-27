import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { updateEntry, deleteEntry } from "@/server/timesheets/timesheetService";
import { entrySchema } from "@/features/timesheets/schemas/entrySchema";

type Ctx = RouteContext<"/api/timesheets/[weekId]/entries/[entryId]">;

export async function PATCH(request: NextRequest, ctx: Ctx) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { weekId, entryId } = await ctx.params;
    const body = await request.json();
    const parsed = entrySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const result = updateEntry(weekId, entryId, parsed.data);
    if (!result.ok) {
      if (result.reason === "exceeds_weekly_limit") {
        return NextResponse.json({ error: "Weekly hours cannot exceed 40 hours." }, { status: 400 });
      }
      const message =
        result.reason === "week_not_found"
          ? `Week not found: ${weekId}`
          : result.reason === "entry_not_found"
            ? `Entry not found: ${entryId}`
            : `Project not found: ${parsed.data.projectId}`;
      return NextResponse.json({ error: message }, { status: 404 });
    }

    return NextResponse.json(result.entry);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { weekId, entryId } = await ctx.params;
    const result = deleteEntry(weekId, entryId);

    if (result !== "deleted") {
      const message =
        result === "week_not_found" ? `Week not found: ${weekId}` : `Entry not found: ${entryId}`;
      return NextResponse.json({ error: message }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
