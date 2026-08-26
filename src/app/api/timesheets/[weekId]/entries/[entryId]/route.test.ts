/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { PATCH, DELETE } from "./route";
import { auth } from "@/auth";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

const mockedAuth = auth as unknown as jest.Mock;

beforeEach(() => {
  mockedAuth.mockResolvedValue({
    user: { id: "1", name: "John Doe", email: "john@example.com" },
    expires: "2099-01-01",
  });
});

function jsonRequest(method: string, url: string, body?: unknown) {
  return new NextRequest(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

const validPayload = {
  date: "2024-01-01",
  projectId: "project-2",
  typeOfWork: "Testing",
  description: "Updated description",
  hours: 5,
};

describe("PATCH /api/timesheets/[weekId]/entries/[entryId]", () => {
  it("updates an existing entry", async () => {
    const response = await PATCH(
      jsonRequest("PATCH", "http://localhost/api/timesheets/week-1/entries/entry-1", validPayload),
      { params: Promise.resolve({ weekId: "week-1", entryId: "entry-1" }) },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.id).toBe("entry-1");
    expect(body.projectName).toBe("Mobile App");
    expect(body.hours).toBe(5);
  });

  it("returns 401 when there is no session", async () => {
    mockedAuth.mockResolvedValue(null);

    const response = await PATCH(
      jsonRequest("PATCH", "http://localhost/api/timesheets/week-1/entries/entry-1", validPayload),
      { params: Promise.resolve({ weekId: "week-1", entryId: "entry-1" }) },
    );

    expect(response.status).toBe(401);
  });

  it("returns 400 for an invalid payload", async () => {
    const response = await PATCH(
      jsonRequest("PATCH", "http://localhost/api/timesheets/week-1/entries/entry-1", {
        ...validPayload,
        description: "",
      }),
      { params: Promise.resolve({ weekId: "week-1", entryId: "entry-1" }) },
    );

    expect(response.status).toBe(400);
  });

  it("returns 404 when the entry does not belong to the given week", async () => {
    const response = await PATCH(
      jsonRequest("PATCH", "http://localhost/api/timesheets/week-2/entries/entry-1", validPayload),
      { params: Promise.resolve({ weekId: "week-2", entryId: "entry-1" }) },
    );

    expect(response.status).toBe(404);
  });

  it("returns 404 for an unknown entry", async () => {
    const response = await PATCH(
      jsonRequest(
        "PATCH",
        "http://localhost/api/timesheets/week-1/entries/does-not-exist",
        validPayload,
      ),
      { params: Promise.resolve({ weekId: "week-1", entryId: "does-not-exist" }) },
    );

    expect(response.status).toBe(404);
  });
});

describe("DELETE /api/timesheets/[weekId]/entries/[entryId]", () => {
  it("returns 401 when there is no session", async () => {
    mockedAuth.mockResolvedValue(null);

    const response = await DELETE(
      jsonRequest("DELETE", "http://localhost/api/timesheets/week-2/entries/entry-2"),
      { params: Promise.resolve({ weekId: "week-2", entryId: "entry-2" }) },
    );

    expect(response.status).toBe(401);
  });

  it("deletes an existing entry and reports 404 on a second delete", async () => {
    const first = await DELETE(
      jsonRequest("DELETE", "http://localhost/api/timesheets/week-2/entries/entry-6"),
      { params: Promise.resolve({ weekId: "week-2", entryId: "entry-6" }) },
    );
    expect(first.status).toBe(204);

    const second = await DELETE(
      jsonRequest("DELETE", "http://localhost/api/timesheets/week-2/entries/entry-6"),
      { params: Promise.resolve({ weekId: "week-2", entryId: "entry-6" }) },
    );
    expect(second.status).toBe(404);
  });

  it("returns 404 for an unknown week", async () => {
    const response = await DELETE(
      jsonRequest("DELETE", "http://localhost/api/timesheets/does-not-exist/entries/entry-2"),
      { params: Promise.resolve({ weekId: "does-not-exist", entryId: "entry-2" }) },
    );

    expect(response.status).toBe(404);
  });
});
