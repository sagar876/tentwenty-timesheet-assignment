import { test, expect } from "@playwright/test";
import { login } from "./helpers";

// Verifies the real NextAuth session cookie set by the app - not the
// checkbox's visual state - since that's what actually controls whether the
// session survives closing the browser.
async function getSessionCookie(page: import("@playwright/test").Page) {
  const cookies = await page.context().cookies();
  const cookie = cookies.find((c) => c.name.endsWith("authjs.session-token"));
  if (!cookie) throw new Error("Session cookie was not set after login");
  return cookie;
}

test("with Remember Me, the session cookie persists with a real expiry", async ({ page }) => {
  await login(page, true);

  const cookie = await getSessionCookie(page);
  expect(cookie.expires).toBeGreaterThan(Date.now() / 1000);
});
