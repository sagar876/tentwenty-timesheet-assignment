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

  it("rejects hours below the minimum", () => {
    const result = entrySchema.safeParse({ ...validInput, hours: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects hours above the per-entry maximum", () => {
    const result = entrySchema.safeParse({ ...validInput, hours: 25 });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer hours", () => {
    const result = entrySchema.safeParse({ ...validInput, hours: 4.5 });
    expect(result.success).toBe(false);
  });
});
