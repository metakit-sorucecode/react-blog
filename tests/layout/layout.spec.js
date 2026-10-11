import { test, expect } from "@playwright/test";

const menus = [
  { name: "홈", path: "/" },
  { name: "로그인", path: "/login-form" },
  { name: "회원가입", path: "/join-form" },
  { name: "글쓰기", path: "/save-form" },
  { name: "내 정보", path: "/user-info" },
];

function menu(page, name) {
  return page.getByRole("link", { name, exact: true });
}

// 바탕색을 캔버스에 칠해 밝기로 바꾼다. 투명하면 흰 바탕이 비치므로 255로 본다
async function backgroundBrightness(locator) {
  return locator.evaluate((el) => {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = getComputedStyle(el).backgroundColor;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    if (a === 0) return 255;
    return (r + g + b) / 3;
  });
}

test("S1 홈 주소(/)에 들어가면 맨 위에 헤더가 보이고 그 아래에 홈 화면이 보인다", async ({ page }) => {
  await page.goto("/");
  const header = menu(page, "로그인");
  const home = page.getByRole("heading", { name: "홈" });
  await expect(header).toBeVisible();
  await expect(home).toBeVisible();

  const headerBox = await header.boundingBox();
  const homeBox = await home.boundingBox();
  expect(homeBox.y).toBeGreaterThan(headerBox.y + headerBox.height);
});

test("S2 헤더와 홈 화면은 화면 가장자리에서 여백을 두고 놓인다", async ({ page }) => {
  await page.goto("/");
  const home = page.getByRole("heading", { name: "홈" });
  await expect(home).toBeVisible();

  const width = page.viewportSize().width;
  for (const locator of [menu(page, "홈"), home]) {
    const box = await locator.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(16);
    expect(box.y).toBeGreaterThanOrEqual(16);
    expect(box.x + box.width).toBeLessThanOrEqual(width - 16);
  }
});

test("S3 헤더에 홈, 로그인, 회원가입, 글쓰기, 내 정보 메뉴가 보인다", async ({ page }) => {
  await page.goto("/");
  for (const { name } of menus) {
    await expect(menu(page, name)).toBeVisible();
  }
});

test("S4 메뉴를 누르면 그 주소로 간다", async ({ page }) => {
  for (const { name, path } of menus) {
    // 아직 화면이 없는 주소는 헤더가 없으므로 매번 홈에서 누른다
    await page.goto("/");
    await menu(page, name).click();
    await expect(page).toHaveURL(new RegExp(`5173${path}$`));
  }
});

test("S5 지금 보고 있는 화면의 메뉴가 강조된다. 홈에서는 홈 메뉴만 강조된다", async ({ page }) => {
  await page.goto("/");
  await expect(menu(page, "홈")).toBeVisible();

  expect(await backgroundBrightness(menu(page, "홈"))).toBeLessThan(80);
  for (const { name } of menus.slice(1)) {
    expect(await backgroundBrightness(menu(page, name))).toBeGreaterThan(200);
  }
});
