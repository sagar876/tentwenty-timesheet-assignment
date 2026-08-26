/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET } from "./route";
import { auth } from "@/auth";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

const mockedAuth = auth as unknown as jest.Mock;

describe("GET /api/timesheets/[weekId]", () => {
  beforeEach(() => {
    mockedAuth.mockResolvedValue({
      user: { id: "1", name: "John Doe", email: "john@example.com" },
      expires: "2099-01-01",
    });
  });

  it("returns 401 when there is no session", async () => {
    mockedAuth.mockResolvedValue(null);

    const response = await GET(new NextRequest("http://localhost/api/timesheets/week-1"), {
      params: Promise.resolve({ weekId: "week-1" }),
    });

    expect(response.status).toBe(401);
  });

  it("returns week detail with its entries", async () => {
    const response = await GET(new NextRequest("http://localhost/api/timesheets/week-1"), {
      params: Promise.resolve({ weekId: "week-1" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.week.id).toBe("week-1");
    expect(body.week.status).toBe("completed");
    expect(body.entries.length).toBeGreaterThan(0);
  });

  it("returns an empty entry list for a week with no hours logged", async () => {
    const response = await GET(new NextRequest("http://localhost/api/timesheets/week-5"), {
      params: Promise.resolve({ weekId: "week-5" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.week.status).toBe("missing");
    expect(body.entries).toHaveLength(0);
  });

  it("returns 404 for an unknown week", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/timesheets/does-not-exist"),
      { params: Promise.resolve({ weekId: "does-not-exist" }) },
    );

    expect(response.status).toBe(404);
  });
});
