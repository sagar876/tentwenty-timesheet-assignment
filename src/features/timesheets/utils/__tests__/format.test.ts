import { formatDateRange, formatDayLabel, getDatesInRange } from "../format";

describe("formatDateRange", () => {
  it("formats a range within the same month", () => {
    expect(formatDateRange("2024-01-01", "2024-01-05")).toBe("1 - 5 January, 2024");
  });

  it("formats a range spanning two months", () => {
    expect(formatDateRange("2024-01-29", "2024-02-02")).toBe(
      "29 January - 2 February, 2024",
    );
  });
});

describe("formatDayLabel", () => {
  it("formats a single date as 'Mon D'", () => {
    expect(formatDayLabel("2024-01-01")).toBe("Jan 1");
  });
});

describe("getDatesInRange", () => {
  it("enumerates every date in a Mon-Fri week inclusive", () => {
    expect(getDatesInRange("2024-01-01", "2024-01-05")).toEqual([
      "2024-01-01",
      "2024-01-02",
      "2024-01-03",
      "2024-01-04",
      "2024-01-05",
    ]);
  });

  it("returns a single date when start equals end", () => {
    expect(getDatesInRange("2024-01-01", "2024-01-01")).toEqual(["2024-01-01"]);
  });
});
