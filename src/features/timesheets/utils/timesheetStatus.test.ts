import { computeStatus, WEEK_TARGET_HOURS } from "./timesheetStatus";

describe("computeStatus", () => {
  it("returns missing when no hours are logged", () => {
    expect(computeStatus(0)).toBe("missing");
  });

  it("returns incomplete when below the weekly target", () => {
    expect(computeStatus(WEEK_TARGET_HOURS - 1)).toBe("incomplete");
  });

  it("returns completed at exactly the weekly target", () => {
    expect(computeStatus(WEEK_TARGET_HOURS)).toBe("completed");
  });

  it("returns completed above the weekly target", () => {
    expect(computeStatus(WEEK_TARGET_HOURS + 8)).toBe("completed");
  });
});
