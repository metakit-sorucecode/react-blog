import { test, expect } from "@playwright/test";

const LOGIN_API = "http://localhost:8080/login";

function menu(page, name) {
  return page.getByRole("link", { name, exact: true });
}

// 홈 메뉴가 든 목록이 헤더다. 칸마다 글자를 차례대로 꺼낸다
function headerItems(page) {
  return page
    .getByRole("list")
    .filter({ has: menu(page, "홈") })
    .getByRole("listitem");
}

function savedJwt(page) {
  return page.evaluate(() => localStorage.getItem("jwt"));
}

// 로그인하고 서버가 응답 헤더로 준 토큰을 돌려준다
async function login(page) {
  await page.goto("/login-form");
  await page.getByPlaceholder("아이디").fill("ssar");
  await page.getByPlaceholder("비밀번호").fill("1234");

  const responded = page.waitForResponse(
    (res) => res.url() === LOGIN_API && res.request().method() === "POST",
    { timeout: 5000 },
  );
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  const res = await responded;
  await expect(page).toHaveURL(/5173\/$/);
  return res.headers()["authorization"];
}

test("S1 로그인에 성공하면 받은 토큰을 브라우저 저장소에 남긴다", async ({
  page,
}) => {
  const jwt = await login(page);

  expect(jwt).toMatch(/^Bearer /);
  expect(await savedJwt(page)).toBe(jwt);
});

test("S2 앱이 시작할 때 저장된 토큰이 있으면 토큰 안의 아이디를 꺼내 로그인 상태를 되살린다", async ({
  page,
}) => {
  await login(page);

  await page.reload();

  await expect(headerItems(page)).toHaveText([
    "홈",
    "글쓰기",
    "내 정보",
    "로그아웃",
    "ssar님",
  ]);
});

test("S3 로그아웃하면 저장한 토큰을 지운다", async ({ page }) => {
  await login(page);
  // 저장된 토큰이 있어야 지우는지 볼 수 있다
  expect(await savedJwt(page)).not.toBeNull();

  await page.getByRole("button", { name: "로그아웃", exact: true }).click();
  await expect(headerItems(page)).toHaveText(["홈", "로그인", "회원가입"]);
  expect(await savedJwt(page)).toBeNull();

  await page.reload();

  await expect(headerItems(page)).toHaveText(["홈", "로그인", "회원가입"]);
});
