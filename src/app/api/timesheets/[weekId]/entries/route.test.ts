/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { POST } from "./route";
import { auth } from "@/auth";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

const mockedAuth = auth as unknown as jest.Mock;

function jsonRequest(url: string, body: unknown) {
  return new NextRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validPayload = {
  date: "2024-01-29",
  projectId: "project-1",
  typeOfWork: "Bug fixes",
  description: "Investigate flaky test",
  hours: 3,
};

describe("POST /api/timesheets/[weekId]/entries", () => {
  beforeEach(() => {
    mockedAuth.mockResolvedValue({
      user: { id: "1", name: "John Doe", email: "john@example.com" },
      expires: "2099-01-01",
    });
  });

  it("creates a new entry", async () => {
    const response = await POST(
      jsonRequest("http://localhost/api/timesheets/week-5/entries", validPayload),
      { params: Promise.resolve({ weekId: "week-5" }) },
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.weekId).toBe("week-5");
    expect(body.projectName).toBe("Client Website Redesign");
    expect(body.hours).toBe(3);
  });

  it("returns 401 when there is no session", async () => {
    mockedAuth.mockResolvedValue(null);

    const response = await POST(
      jsonRequest("http://localhost/api/timesheets/week-5/entries", validPayload),
      { params: Promise.resolve({ weekId: "week-5" }) },
    );

    expect(response.status).toBe(401);
  });

  it("returns 400 for an invalid payload", async () => {
    const response = await POST(
      jsonRequest("http://localhost/api/timesheets/week-5/entries", {
        ...validPayload,
        hours: 0,
      }),
      { params: Promise.resolve({ weekId: "week-5" }) },
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.issues.hours).toBeDefined();
  });

  it("returns 404 for an unknown week", async () => {
    const response = await POST(
      jsonRequest("http://localhost/api/timesheets/does-not-exist/entries", validPayload),
      { params: Promise.resolve({ weekId: "does-not-exist" }) },
    );

    expect(response.status).toBe(404);
  });

  it("returns 404 for an unknown project", async () => {
    const response = await POST(
      jsonRequest("http://localhost/api/timesheets/week-5/entries", {
        ...validPayload,
        projectId: "does-not-exist",
      }),
      { params: Promise.resolve({ weekId: "week-5" }) },
    );

    expect(response.status).toBe(404);
  });
});
