import { test, expect } from "@playwright/test";

const JOIN_API = "http://localhost:8080/join";
const RULE_TEXT = "비밀번호는 4자 이상이어야 합니다";

// 테스트마다 새 아이디를 쓴다. 같은 아이디는 서버가 막는다
function newUser() {
  const username = `kim${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return { username, email: `${username}@nate.com` };
}

function passwordBox(page) {
  return page.getByPlaceholder("비밀번호");
}

function ruleText(page) {
  return page.getByText(RULE_TEXT, { exact: true });
}

function joinButton(page) {
  return page.getByRole("button", { name: "가입하기", exact: true });
}

// 회원가입 요청 수를 센다
function countJoins(page) {
  const joins = [];
  page.on("request", (req) => {
    if (req.url() === JOIN_API && req.method() === "POST") joins.push(req);
  });
  return joins;
}

test("S7 회원가입 비밀번호는 칠 때마다 검사해 1자에서 3자면 문구를 보이고 4자가 되면 지운다", async ({
  page,
}) => {
  await page.goto("/join-form");

  // 가입하기를 누르지 않고 치기만 한다
  await passwordBox(page).fill("1");
  await expect(ruleText(page)).toBeVisible();
  await passwordBox(page).fill("123");
  await expect(ruleText(page)).toBeVisible();

  await passwordBox(page).fill("1234");
  await expect(ruleText(page)).toHaveCount(0);
});

test("S8 비밀번호가 3자인 채 가입하기를 누르면 요청을 보내지 않고 비밀번호 칸에 커서가 간다", async ({
  page,
}) => {
  const user = newUser();
  const joins = countJoins(page);
  await page.goto("/join-form");
  await page.getByPlaceholder("아이디").fill(user.username);
  await passwordBox(page).fill("123");
  await page.getByPlaceholder("이메일").fill(user.email);

  await joinButton(page).click();

  await expect(ruleText(page)).toBeVisible();
  await expect(passwordBox(page)).toBeFocused();
  // 요청이 가지 않았는지 잠깐 기다린 뒤 센다
  await page.waitForTimeout(500);
  expect(joins).toHaveLength(0);
  await expect(page).toHaveURL(/\/join-form$/);
});

test("S9 비밀번호 칸이 비어 있으면 규칙을 검사하지 않고 서버가 막아 입력값이 필요하다는 토스트가 뜬다", async ({
  page,
}) => {
  const user = newUser();
  const joins = countJoins(page);
  await page.goto("/join-form");
  await page.getByPlaceholder("아이디").fill(user.username);
  await page.getByPlaceholder("이메일").fill(user.email);

  // 문구가 뜬 칸을 비우면 문구가 사라진다. 빈 값은 검사하지 않는다
  await passwordBox(page).fill("123");
  await expect(ruleText(page)).toBeVisible();
  await passwordBox(page).fill("");
  await expect(ruleText(page)).toHaveCount(0);

  await joinButton(page).click();

  await expect(
    page.getByText("입력값이 필요합니다", { exact: true }),
  ).toBeVisible();
  expect(joins).toHaveLength(1);
  await expect(page).toHaveURL(/\/join-form$/);
});
