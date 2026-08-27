import { sumHours } from "../hours";

describe("sumHours", () => {
  it("returns 0 for an empty list", () => {
    expect(sumHours([])).toBe(0);
  });

  it("sums whole numbers", () => {
    expect(sumHours([1, 2, 3])).toBe(6);
  });

  it("sums arbitrary decimals without floating-point drift", () => {
    expect(sumHours([1.1, 2.3, 4.75])).toBe(8.15);
  });

  it("sums values that individually cause float drift with naive addition", () => {
    expect(0.1 + 0.2).not.toBe(0.3);
    expect(sumHours([0.1, 0.2])).toBe(0.3);
  });

  it("sums quarter-hour values", () => {
    expect(sumHours([7.5, 8, 6.25])).toBe(21.75);
  });
});
