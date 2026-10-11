import { test, expect } from "@playwright/test";

const JOIN_API = "http://localhost:8080/join";

// 테스트마다 새 아이디를 쓴다. 같은 아이디는 서버가 막는다
function newUser() {
  const username = `kim${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return { username, password: "1234", email: `${username}@nate.com` };
}

async function fillJoinForm(page, user) {
  await page.goto("/join-form");
  await page.getByPlaceholder("아이디").fill(user.username);
  await page.getByPlaceholder("비밀번호").fill(user.password);
  await page.getByPlaceholder("이메일").fill(user.email);
}

function joinButton(page) {
  return page.getByRole("button", { name: "가입하기", exact: true });
}

test("S1 아이디, 비밀번호, 이메일을 입력하고 가입하기를 누르면 입력한 값을 서버(POST /join)에 보낸다", async ({
  page,
}) => {
  const user = newUser();
  await fillJoinForm(page, user);

  // 새로고침되면 이 표시가 사라진다
  await page.evaluate(() => (window.notReloaded = true));

  const requested = page.waitForRequest(
    (req) => req.url() === JOIN_API && req.method() === "POST",
    { timeout: 5000 },
  );
  await joinButton(page).click();
  const req = await requested;

  expect(req.postDataJSON()).toEqual(user);
  const res = await req.response();
  expect(res.status()).toBe(200);
  expect(await page.evaluate(() => window.notReloaded)).toBe(true);
});

test("S2 가입에 성공하면 회원가입 완료 안내를 띄운다", async ({ page }) => {
  await fillJoinForm(page, newUser());

  const shown = page.waitForEvent("dialog", { timeout: 5000 });
  await joinButton(page).click();
  const dialog = await shown;

  expect(dialog.message()).toContain("회원가입 완료");
  await dialog.accept();
});

test("S3 안내를 닫으면 로그인 화면(/login-form)으로 간다", async ({ page }) => {
  await fillJoinForm(page, newUser());

  page.once("dialog", (dialog) => dialog.accept());
  await joinButton(page).click();

  await expect(page).toHaveURL(/5173\/login-form$/);
  await expect(
    page.getByRole("heading", { name: "로그인", exact: true }),
  ).toBeVisible();
});
