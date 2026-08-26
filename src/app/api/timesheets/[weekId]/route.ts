import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { getWeekDetail } from "@/server/timesheets/timesheetService";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/timesheets/[weekId]">,
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { weekId } = await ctx.params;
    const detail = getWeekDetail(weekId);

    if (!detail) {
      return NextResponse.json({ error: `Week not found: ${weekId}` }, { status: 404 });
    }

    return NextResponse.json(detail);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
