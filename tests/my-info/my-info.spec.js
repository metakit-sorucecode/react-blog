import { test, expect } from "@playwright/test";

const API = "http://localhost:8080";
const USER_API = `${API}/api/user`;

// 시드 계정의 이메일과 비밀번호를 바꾸면 다른 장 테스트가 깨진다. 테스트마다 새 사용자를 만든다
// 아이디도 화면에 박아 둔 ssar가 아니라 서버에서 받은 값인지 보인다
function newUser() {
  const username = `lee${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return { username, password: "1234", email: `${username}@nate.com` };
}

async function join(request, user) {
  const res = await request.post(`${API}/join`, { data: user });
  expect(res.status()).toBe(200);
}

async function login(page, username, password) {
  await page.goto("/login-form");
  await page.getByPlaceholder("아이디").fill(username);
  await page.getByPlaceholder("비밀번호").fill(password);
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page).toHaveURL(/5173\/$/);
  await expect(page.getByText(`${username}님`, { exact: true })).toBeVisible();
}

function menu(page, name) {
  return page.getByRole("link", { name, exact: true });
}

function usernameBox(page) {
  return page.getByRole("textbox").first();
}

// 헤더 메뉴로 내 정보에 들어가고 내 정보 요청이 끝날 때까지 기다린다
async function openUserInfo(page) {
  await menu(page, "내 정보").click();
  await expect(page).toHaveURL(/5173\/user-info$/);
  await page.waitForLoadState("networkidle");
}

// 내 정보를 바꾸고 수정하기를 눌러 보낸 요청을 돌려준다
async function submitUserInfo(page, email, password) {
  await openUserInfo(page);
  await page.getByPlaceholder("이메일").fill(email);
  await page.getByPlaceholder("새 비밀번호").fill(password);

  const requested = page.waitForRequest(
    (req) => req.url() === USER_API && req.method() === "PUT",
    { timeout: 5000 },
  );
  await page.getByRole("button", { name: "수정하기", exact: true }).click();
  const req = await requested;
  expect((await req.response()).status()).toBe(200);
  return req;
}

// form-hook 장부터 입력값은 state가 아니라 입력칸이 기억한다 (react-hook-form)
// 그래서 React props의 value 대신 입력칸에 남은 값을 본다

test("S1 내 정보 화면에 들어가면 서버에서 내 정보를 받아 아이디와 이메일 칸을 채운다", async ({
  page,
  request,
}) => {
  const user = newUser();
  await join(request, user);
  await login(page, user.username, user.password);

  const requested = page.waitForRequest(
    (req) => req.url() === USER_API && req.method() === "GET",
    { timeout: 5000 },
  );
  await menu(page, "내 정보").click();
  await requested;

  await expect(usernameBox(page)).toHaveValue(user.username);
  await expect(usernameBox(page)).not.toBeEditable();
  await expect(page.getByPlaceholder("이메일")).toHaveValue(user.email);
  await expect(page.getByPlaceholder("새 비밀번호")).toHaveValue("");
});

test("S2 이메일과 새 비밀번호 칸을 고치면 화면이 고친 값을 기억한다", async ({
  page,
  request,
}) => {
  const user = newUser();
  await join(request, user);
  await login(page, user.username, user.password);

  await openUserInfo(page);
  await page.getByPlaceholder("이메일").fill(`new-${user.email}`);
  await page.getByPlaceholder("새 비밀번호").fill("5678");

  await expect(page.getByPlaceholder("이메일")).toHaveValue(
    `new-${user.email}`,
  );
  await expect(page.getByPlaceholder("새 비밀번호")).toHaveValue("5678");
});

test("S3 수정하기를 누르면 이메일과 새 비밀번호를 서버에 보내고 홈으로 간다", async ({
  page,
  request,
}) => {
  const user = newUser();
  await join(request, user);
  await login(page, user.username, user.password);
  const email = `new-${user.email}`;

  const req = await submitUserInfo(page, email, "");
  expect(req.postDataJSON()).toEqual({ email, password: "" });

  await expect(page).toHaveURL(/5173\/$/);

  // 내 정보에 다시 들어오면 서버가 바뀐 이메일을 준다
  await openUserInfo(page);
  await expect(page.getByPlaceholder("이메일")).toHaveValue(email);
});

test("S4 새 비밀번호를 넣어 수정하면 로그아웃 뒤 새 비밀번호로 로그인된다", async ({
  page,
  request,
}) => {
  const user = newUser();
  await join(request, user);
  await login(page, user.username, user.password);

  const req = await submitUserInfo(page, user.email, "5678");
  expect(req.postDataJSON()).toEqual({ email: user.email, password: "5678" });
  await expect(page).toHaveURL(/5173\/$/);

  await page.getByRole("button", { name: "로그아웃", exact: true }).click();
  await login(page, user.username, "5678");

  // 원래 비밀번호로는 로그인되지 않는다
  const res = await request.post(`${API}/login`, {
    data: { username: user.username, password: user.password },
  });
  expect(res.status()).toBe(400);
});

test("S5 새 비밀번호를 비워 수정하면 비밀번호는 그대로다", async ({
  page,
  request,
}) => {
  const user = newUser();
  await join(request, user);
  await login(page, user.username, user.password);

  const req = await submitUserInfo(page, `new-${user.email}`, "");
  expect(req.postDataJSON().password).toBe("");
  await expect(page).toHaveURL(/5173\/$/);

  await page.getByRole("button", { name: "로그아웃", exact: true }).click();
  await login(page, user.username, user.password);
});
