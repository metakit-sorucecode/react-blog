import { test, expect } from "@playwright/test";

const LOGIN_API = "http://localhost:8080/login";

// 로그인 상태는 메모리에만 있다. 로그인한 뒤에는 page.goto 대신 클릭으로 움직인다
async function fillLoginForm(page) {
  await page.goto("/login-form");
  await page.getByPlaceholder("아이디").fill("ssar");
  await page.getByPlaceholder("비밀번호").fill("1234");
}

function loginButton(page) {
  return page.getByRole("button", { name: "로그인", exact: true });
}

async function login(page) {
  await fillLoginForm(page);
  await loginButton(page).click();
  await expect(page).toHaveURL(/5173\/$/);
}

function menu(page, name) {
  return page.getByRole("link", { name, exact: true });
}

function logoutButton(page) {
  return page.getByRole("button", { name: "로그아웃", exact: true });
}

// 홈 메뉴가 든 목록이 헤더다. 칸마다 글자를 차례대로 꺼낸다
function headerItems(page) {
  return page
    .getByRole("list")
    .filter({ has: menu(page, "홈") })
    .getByRole("listitem");
}

test("S1 아이디와 비밀번호를 입력하고 로그인을 누르면 입력한 값을 서버(POST /login)에 보낸다", async ({
  page,
}) => {
  await fillLoginForm(page);

  // 새로고침되면 이 표시가 사라진다
  await page.evaluate(() => (window.notReloaded = true));

  const requested = page.waitForRequest(
    (req) => req.url() === LOGIN_API && req.method() === "POST",
    { timeout: 5000 },
  );
  await loginButton(page).click();
  const req = await requested;

  expect(req.postDataJSON()).toEqual({ username: "ssar", password: "1234" });
  const res = await req.response();
  expect(res.status()).toBe(200);
  expect(await page.evaluate(() => window.notReloaded)).toBe(true);
});

test("S2 로그인에 성공하면 응답 헤더의 토큰과 아이디를 로그인 상태로 기억하고 홈으로 간다", async ({
  page,
}) => {
  await fillLoginForm(page);

  const responded = page.waitForResponse(
    (res) => res.url() === LOGIN_API && res.request().method() === "POST",
    { timeout: 5000 },
  );
  await loginButton(page).click();
  const res = await responded;

  expect(res.headers()["authorization"]).toMatch(/^Bearer /);
  await expect(page).toHaveURL(/5173\/$/);
  await expect(page.getByRole("link", { name: /^제목/ }).first()).toBeVisible();
});

test("S3 로그인 전 헤더 메뉴는 홈, 로그인, 회원가입이다", async ({ page }) => {
  await page.goto("/");

  for (const name of ["홈", "로그인", "회원가입"]) {
    await expect(menu(page, name)).toBeVisible();
  }
  for (const name of ["글쓰기", "내 정보"]) {
    await expect(menu(page, name)).toHaveCount(0);
  }
  await expect(logoutButton(page)).toHaveCount(0);
});

test("S4 로그인 뒤 헤더 메뉴는 홈, 글쓰기, 내 정보, 로그아웃이고 메뉴 끝에 ssar님이 보인다", async ({
  page,
}) => {
  await login(page);

  for (const name of ["홈", "글쓰기", "내 정보"]) {
    await expect(menu(page, name)).toBeVisible();
  }
  await expect(logoutButton(page)).toBeVisible();
  await expect(page.getByText("ssar님", { exact: true })).toBeVisible();
  for (const name of ["로그인", "회원가입"]) {
    await expect(menu(page, name)).toHaveCount(0);
  }
  await expect(headerItems(page)).toHaveText([
    "홈",
    "글쓰기",
    "내 정보",
    "로그아웃",
    "ssar님",
  ]);

  // 로그인 뒤 메뉴가 제 화면으로 가는지도 본다
  await menu(page, "내 정보").click();
  await expect(page).toHaveURL(/5173\/user-info$/);
  await expect(
    page.getByRole("heading", { name: "내 정보", exact: true }),
  ).toBeVisible();
});

test("S5 로그아웃을 누르면 로그인 상태를 비우고 홈으로 간다", async ({
  page,
}) => {
  await login(page);
  // 홈이 아닌 화면에서 로그아웃해야 홈으로 가는지 보인다
  await menu(page, "글쓰기").click();
  await expect(page).toHaveURL(/5173\/save-form$/);

  await logoutButton(page).click();

  await expect(page).toHaveURL(/5173\/$/);
  for (const name of ["로그인", "회원가입"]) {
    await expect(menu(page, name)).toBeVisible();
  }
  await expect(menu(page, "글쓰기")).toHaveCount(0);
  await expect(page.getByText("ssar님", { exact: true })).toHaveCount(0);
  await expect(headerItems(page)).toHaveText(["홈", "로그인", "회원가입"]);
});
