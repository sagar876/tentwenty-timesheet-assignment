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

describe("GET /api/timesheets", () => {
  beforeEach(() => {
    mockedAuth.mockResolvedValue({
      user: { id: "1", name: "John Doe", email: "john@example.com" },
      expires: "2099-01-01",
    });
  });

  it("returns 401 when there is no session", async () => {
    mockedAuth.mockResolvedValue(null);

    const response = await GET(new NextRequest("http://localhost/api/timesheets"));

    expect(response.status).toBe(401);
  });

  it("returns the first page of week summaries by default", async () => {
    const response = await GET(new NextRequest("http://localhost/api/timesheets"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.items).toHaveLength(5);
    expect(body.total).toBe(10);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(5);
  });

  it("filters by status", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/timesheets?status=missing"),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.total).toBe(2);
    expect(
      body.items.every((week: { status: string }) => week.status === "missing"),
    ).toBe(true);
  });

  it("rejects an invalid status filter", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/timesheets?status=bogus"),
    );

    expect(response.status).toBe(400);
  });

  it("rejects a non-positive page number", async () => {
    const response = await GET(new NextRequest("http://localhost/api/timesheets?page=0"));

    expect(response.status).toBe(400);
  });

  it("sorts by week number ascending by default", async () => {
    const response = await GET(new NextRequest("http://localhost/api/timesheets"));
    const body = await response.json();

    expect(body.items.map((week: { weekNumber: number }) => week.weekNumber)).toEqual([
      1, 2, 3, 4, 5,
    ]);
  });

  it("reverses order when sortDir is desc", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/timesheets?sortBy=weekNumber&sortDir=desc"),
    );
    const body = await response.json();

    expect(body.items.map((week: { weekNumber: number }) => week.weekNumber)).toEqual([
      10, 9, 8, 7, 6,
    ]);
  });

  it("sorts by status", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/timesheets?sortBy=status&sortDir=asc&pageSize=10"),
    );
    const body = await response.json();
    const statuses = body.items.map((week: { status: string }) => week.status);

    expect(statuses).toEqual([...statuses].sort());
  });

  it("rejects an invalid sortBy", async () => {
    const response = await GET(new NextRequest("http://localhost/api/timesheets?sortBy=bogus"));

    expect(response.status).toBe(400);
  });

  it("rejects an invalid sortDir", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/timesheets?sortDir=sideways"),
    );

    expect(response.status).toBe(400);
  });
});
