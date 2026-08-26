import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getProjects } from "@/server/projects/projectsService";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(getProjects());
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
