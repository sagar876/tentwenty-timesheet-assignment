import { persistSession } from "./sessionPersistence";
import { auth } from "@/auth";
import { cookies } from "next/headers";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

const mockedAuth = auth as unknown as jest.Mock;
const mockedCookies = cookies as unknown as jest.Mock;

describe("persistSession", () => {
  const set = jest.fn();
  const getAll = jest.fn();

  beforeEach(() => {
    set.mockReset();
    getAll.mockReset();
    mockedAuth.mockReset();
    mockedCookies.mockReset();
    mockedCookies.mockResolvedValue({ getAll, set });
  });

  it("leaves the session cookie untouched when remembered", async () => {
    await persistSession(true);

    expect(mockedAuth).not.toHaveBeenCalled();
    expect(set).not.toHaveBeenCalled();
  });

  it("does nothing when there is no active session", async () => {
    mockedAuth.mockResolvedValue(null);

    await persistSession(false);

    expect(set).not.toHaveBeenCalled();
  });

  it("rewrites the session cookie as a session-only cookie when not remembered", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "1" }, expires: "2099-01-01" });
    getAll.mockReturnValue([
      { name: "authjs.session-token", value: "token-value" },
      { name: "authjs.csrf-token", value: "csrf-value" },
    ]);

    await persistSession(false);

    expect(set).toHaveBeenCalledTimes(1);
    const [name, value, options] = set.mock.calls[0]!;
    expect(name).toBe("authjs.session-token");
    expect(value).toBe("token-value");
    expect(options).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/", secure: false });
    expect(options).not.toHaveProperty("maxAge");
    expect(options).not.toHaveProperty("expires");
  });

  it("keeps the secure flag for a __Secure- prefixed cookie", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "1" }, expires: "2099-01-01" });
    getAll.mockReturnValue([{ name: "__Secure-authjs.session-token", value: "token-value" }]);

    await persistSession(false);

    const [, , options] = set.mock.calls[0]!;
    expect(options).toMatchObject({ secure: true });
  });
});
