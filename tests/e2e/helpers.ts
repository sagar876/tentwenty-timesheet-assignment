import type { Page } from "@playwright/test";

export async function login(page: Page, rememberMe = false) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("john@example.com");
  await page.getByLabel("Password").fill("password123");
  if (rememberMe) {
    await page.getByLabel("Remember me").check();
  }
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("heading", { name: "Your Timesheets" }).waitFor();
}
