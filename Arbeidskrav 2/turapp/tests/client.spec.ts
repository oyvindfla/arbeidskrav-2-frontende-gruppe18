import { test, expect } from "@playwright/test";
test("search, translated filters and persistent favourites", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Det starter med en tur." }),
  ).toBeVisible();
  await page.screenshot({ path: "/tmp/turlyst-desktop.png", fullPage: true });
  await page.getByLabel("Hvor vil du på tur?").fill("Besseggen");
  await expect(page.locator(".trip-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Lagre favoritt", exact: true })
    .click();
  await page.reload();
  await page.getByRole("button", { name: "Favoritter", exact: true }).click();
  await expect(page.locator(".trip-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Utforsk", exact: true }).click();
  await page.getByLabel("Språk / Language").selectOption("en");
  await page.getByLabel("Difficulty", { exact: true }).selectOption("Krevende");
  await expect(page.locator(".trip-card")).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Besseggen" })).toBeVisible();
});
test("profile, group booking and route import", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Profil", exact: true }).click();
  await page.getByLabel("Navn", { exact: true }).fill("Test Turgåer");
  await page.getByLabel("E-post", { exact: true }).fill("test@example.com");
  await page.getByRole("button", { name: "Lagre demoprofil" }).click();
  await page.getByRole("button", { name: "Utforsk", exact: true }).click();
  await page.getByRole("button", { name: /Fellesturer/ }).click();
  await page.getByRole("button", { name: "Sammen over Besseggen" }).click();
  await page
    .getByRole("button", { name: "Bindende påmelding (demo)", exact: true })
    .click();
  await expect(page.locator(".status")).toContainText("Påmeldt");
  await page.getByRole("button", { name: "Lukk", exact: true }).click();
  await page.getByRole("button", { name: "Mine turer", exact: true }).click();
  await expect(page.locator(".trip-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Ruteverksted", exact: true }).click();
  await page.locator("input[type=file]").setInputFiles({
    name: "route.gpx",
    mimeType: "application/gpx+xml",
    buffer: Buffer.from(
      '<gpx><trk><trkseg><trkpt lat="61.4" lon="8.8"/><trkpt lat="61.5" lon="8.9"/></trkseg></trk></gpx>',
    ),
  });
  await expect(page.getByText("2 rutepunkter", { exact: true })).toBeVisible();
  await page.getByLabel("Rutenavn", { exact: true }).fill("Teststi");
  await page.getByRole("button", { name: "Lagre rute", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "Ruteverksted", exact: true }).click();
  await expect(page.getByRole("button", { name: /Teststi/ })).toBeVisible();
});
test("mobile navigation and layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".trip-card")).toHaveCount(5);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "/tmp/turlyst-mobile-explore.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "Favoritter", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Favoritter", exact: true, level: 1 }),
  ).toBeVisible();
  await page.screenshot({ path: "/tmp/turlyst-mobile.png", fullPage: true });
});
