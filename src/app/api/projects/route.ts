import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PROJECTS } from "@/server/projects/projects";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(PROJECTS);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
