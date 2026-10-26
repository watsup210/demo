import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("home renders all three categories without horizontal overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await expect(
    page.getByRole("heading", { name: "Where are we going?" }),
  ).toBeVisible();
  for (const name of ["Public buses", "Ride-hailing", "Coaches & shuttles"])
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("valid demo search opens preview and Escape dismisses it", async ({
  page,
}) => {
  await page.getByLabel("TO", { exact: true }).fill("Vung Tau City");
  await page.getByRole("button", { name: "Find my journey" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText(
    "Simulated routes, prices and travel times will arrive in Phase 2",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Find my journey" }),
  ).toBeFocused();
});

test("rejects unsupported locations and identical endpoints", async ({
  page,
}) => {
  await page.getByLabel("TO", { exact: true }).fill("Unknown place");
  await page.getByRole("button", { name: "Find my journey" }).click();
  await expect(page.getByRole("alert")).toContainText("demo suggestions");
  await page
    .getByLabel("TO", { exact: true })
    .fill("District 1, Ho Chi Minh City");
  await page.getByRole("button", { name: "Find my journey" }).click();
  await expect(page.getByRole("alert")).toContainText("different");
});

test("swaps locations and uses inspiration as a destination", async ({
  page,
}) => {
  await page.getByRole("button", { name: /A little sea breeze/ }).click();
  await expect(page.getByLabel("TO", { exact: true })).toHaveValue(
    "Vung Tau City",
  );
  await page
    .getByRole("button", { name: "Swap origin and destination" })
    .click();
  await expect(page.getByLabel("FROM", { exact: true })).toHaveValue(
    "Vung Tau City",
  );
  await expect(page.getByLabel("TO", { exact: true })).toHaveValue(
    "District 1, Ho Chi Minh City",
  );
});

test("supports optional depart-at and arrive-by form inputs", async ({
  page,
}) => {
  await page.getByLabel("TO", { exact: true }).fill("Tan Son Nhat Airport");
  for (const mode of ["depart", "arrive"]) {
    await page.getByLabel("Journey timing").selectOption(mode);
    await page.locator('input[type="datetime-local"]').fill("2026-12-01T10:30");
    await page.getByRole("button", { name: "Find my journey" }).click();
    await expect(page.getByRole("dialog")).toContainText("2026-12-01 · 10:30");
    await page.keyboard.press("Escape");
  }
});

test("navigation placeholders and personalization switch work", async ({
  page,
  isMobile,
}) => {
  const navigation = page.getByRole("navigation", {
    name: isMobile ? "Mobile navigation" : "Main navigation",
    exact: true,
  });
  await navigation.getByRole("button", { name: /Saved/ }).click();
  await expect(
    page.getByText("Saving journeys will arrive in Phase 5."),
  ).toBeVisible();
  await navigation.getByRole("button", { name: "History" }).click();
  await expect(
    page.getByText("Journey history will arrive in Phase 5."),
  ).toBeVisible();
  await navigation.getByRole("button", { name: "Preferences" }).click();
  const toggle = page.getByRole("switch", {
    name: "Personalized recommendations",
  });
  await expect(toggle).toBeChecked();
  await toggle.click();
  await expect(toggle).not.toBeChecked();
  await navigation.getByRole("button", { name: "Explore" }).click();
  await expect(
    page.getByRole("heading", { name: "Where are we going?" }),
  ).toBeVisible();
});
