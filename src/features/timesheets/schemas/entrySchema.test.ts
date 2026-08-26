import { entrySchema } from "./entrySchema";

const validInput = {
  date: "2024-01-01",
  projectId: "project-1",
  typeOfWork: "Bug fixes",
  description: "Fix login crash",
  hours: 4,
};

describe("entrySchema", () => {
  it("accepts a valid entry", () => {
    const result = entrySchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects a missing description", () => {
    const result = entrySchema.safeParse({ ...validInput, description: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown type of work", () => {
    const result = entrySchema.safeParse({ ...validInput, typeOfWork: "Napping" });
    expect(result.success).toBe(false);
  });

  it("rejects zero hours", () => {
    const result = entrySchema.safeParse({ ...validInput, hours: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects negative hours", () => {
    const result = entrySchema.safeParse({ ...validInput, hours: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects hours above the per-entry maximum", () => {
    const result = entrySchema.safeParse({ ...validInput, hours: 25 });
    expect(result.success).toBe(false);
  });

  it("rejects non-numeric hours", () => {
    const result = entrySchema.safeParse({ ...validInput, hours: Number.NaN });
    expect(result.success).toBe(false);
  });

  it.each([0.5, 1.5, 2.25, 7.5, 8.5])("accepts %s decimal hours without truncating", (hours) => {
    const result = entrySchema.safeParse({ ...validInput, hours });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.hours).toBe(hours);
    }
  });

  it("rejects hours that aren't in quarter-hour increments", () => {
    const result = entrySchema.safeParse({ ...validInput, hours: 1.3 });
    expect(result.success).toBe(false);
  });

  it("accepts whole-number hours", () => {
    const result = entrySchema.safeParse({ ...validInput, hours: 8 });
    expect(result.success).toBe(true);
  });
});
