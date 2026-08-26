import { getRememberedEmail, setRememberedEmail, clearRememberedEmail } from "./rememberedEmail";

describe("rememberedEmail", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns an empty string when nothing is remembered", () => {
    expect(getRememberedEmail()).toBe("");
  });

  it("round-trips a remembered email", () => {
    setRememberedEmail("john@example.com");
    expect(getRememberedEmail()).toBe("john@example.com");
  });

  it("clears a remembered email", () => {
    setRememberedEmail("john@example.com");
    clearRememberedEmail();
    expect(getRememberedEmail()).toBe("");
  });
});
