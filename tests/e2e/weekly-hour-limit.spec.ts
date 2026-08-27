import { test, expect } from "@playwright/test";
import { login } from "./helpers";

// week-30 has no seeded entries, so this test is safe to re-run without a
// server restart - it deletes its own setup entry at the end.
const WEEK_ROW_LINK = "Create timesheet for week 30";

async function addEntry(page: import("@playwright/test").Page, hours: string) {
  await page.getByRole("button", { name: "Add new task" }).first().click();
  await page.getByRole("combobox", { name: "Select Project" }).click();
  await page.getByRole("option", { name: "Client Website Redesign" }).click();
  await page.getByRole("combobox", { name: "Type of Work" }).click();
  await page.getByRole("option", { name: "Testing" }).click();
  await page.getByLabel("Task description").fill(`Entry for ${hours} hours`);
  await page.getByLabel("Hours", { exact: true }).fill(hours);
  await page.getByRole("button", { name: "Add entry" }).click();
}

test("rejects an entry that would push the week over 40 hours", async ({ page }) => {
  await login(page);

  await page.getByRole("combobox", { name: "Status" }).click();
  await page.getByRole("option", { name: "Missing" }).click();
  await page.getByRole("link", { name: WEEK_ROW_LINK }).click();

  await addEntry(page, "24");
  await expect(page.getByText("24/40 hrs")).toBeVisible();

  await addEntry(page, "20");
  await expect(page.getByRole("alert")).toHaveText("Weekly hours cannot exceed 40 hours.");
  await expect(page.getByText("Entry for 20 hours")).not.toBeVisible();
  await expect(page.getByText("24/40 hrs")).toBeVisible();

  await page.getByRole("button", { name: "Cancel" }).click();
  await page.getByRole("button", { name: "Actions for Entry for 24 hours" }).click();
  await page.getByRole("menuitem", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByText("0/40 hrs")).toBeVisible();
});
