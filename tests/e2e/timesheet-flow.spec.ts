import { test, expect } from "@playwright/test";
import { login } from "./helpers";

// week-20 has no seeded entries (status: Missing), so this test is safe to
// re-run without a server restart - it adds, edits, then deletes its own
// entry, leaving the week back at 0 hours / Missing when it finishes.
const WEEK_ROW_LINK = "Create timesheet for week 20";

test("login, add, edit, delete an entry, with totals and status updating throughout", async ({
  page,
}) => {
  await login(page);

  await page.getByRole("combobox", { name: "Status" }).click();
  await page.getByRole("option", { name: "Missing" }).click();
  await page.getByRole("link", { name: WEEK_ROW_LINK }).click();

  await expect(page.getByRole("heading", { name: "This week's timesheet" })).toBeVisible();
  await expect(page.getByText("0/40 hrs")).toBeVisible();

  await page.getByRole("button", { name: "Add new task" }).first().click();
  await page.getByRole("combobox", { name: "Select Project" }).click();
  await page.getByRole("option", { name: "Client Website Redesign" }).click();
  await page.getByRole("combobox", { name: "Type of Work" }).click();
  await page.getByRole("option", { name: "Bug fixes" }).click();
  await page.getByLabel("Task description").fill("Write onboarding docs");
  await page.getByLabel("Hours", { exact: true }).fill("2.5");
  await page.getByRole("button", { name: "Add entry" }).click();

  await expect(page.getByText("Write onboarding docs")).toBeVisible();
  await expect(page.getByText("2.5 hrs")).toBeVisible();
  await expect(page.getByText("2.5/40 hrs")).toBeVisible();

  await page.getByRole("button", { name: "Actions for Write onboarding docs" }).click();
  await page.getByRole("menuitem", { name: "Edit" }).click();
  await page.getByLabel("Hours", { exact: true }).fill("5");
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByText("5 hrs")).toBeVisible();
  await expect(page.getByText("5/40 hrs")).toBeVisible();

  await page.getByRole("button", { name: "Actions for Write onboarding docs" }).click();
  await page.getByRole("menuitem", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();

  await expect(page.getByText("Write onboarding docs", { exact: true })).not.toBeVisible();
  await expect(page.getByText("0/40 hrs")).toBeVisible();

  await page.getByRole("link", { name: "Timesheets", exact: true }).click();
  await page.getByRole("combobox", { name: "Status" }).click();
  await page.getByRole("option", { name: "Missing" }).click();
  await expect(page.getByRole("link", { name: WEEK_ROW_LINK })).toBeVisible();
});
