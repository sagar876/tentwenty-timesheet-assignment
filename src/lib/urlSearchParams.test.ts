import { buildSearchParamsUrl } from "./urlSearchParams";

describe("buildSearchParamsUrl", () => {
  it("returns the bare pathname when there are no params", () => {
    expect(buildSearchParamsUrl("/dashboard", new URLSearchParams(), {})).toBe("/dashboard");
  });

  it("adds new params to the query string", () => {
    expect(buildSearchParamsUrl("/dashboard", new URLSearchParams(), { page: "2" })).toBe(
      "/dashboard?page=2",
    );
  });

  it("preserves existing params not being updated", () => {
    const current = new URLSearchParams("sort=weekNumber&order=asc");
    expect(buildSearchParamsUrl("/dashboard", current, { page: "2" })).toBe(
      "/dashboard?sort=weekNumber&order=asc&page=2",
    );
  });

  it("overwrites an existing param with a new value", () => {
    const current = new URLSearchParams("page=1");
    expect(buildSearchParamsUrl("/dashboard", current, { page: "3" })).toBe("/dashboard?page=3");
  });

  it("removes a param when its update value is null", () => {
    const current = new URLSearchParams("page=2&sort=startDate");
    expect(buildSearchParamsUrl("/dashboard", current, { page: null })).toBe(
      "/dashboard?sort=startDate",
    );
  });

  it("returns the bare pathname when removing the only param", () => {
    const current = new URLSearchParams("modal=add");
    expect(buildSearchParamsUrl("/timesheets/week-1", current, { modal: null })).toBe(
      "/timesheets/week-1",
    );
  });
});
