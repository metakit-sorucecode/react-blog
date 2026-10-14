import { test, expect } from "@playwright/test";

const API = "http://localhost:8080";
const LOGIN_API = `${API}/login`;

function heading(page, name) {
  return page.getByRole("heading", { name, exact: true });
}

function editLink(page) {
  return page.getByRole("link", { name: "수정", exact: true });
}

function deleteButton(page) {
  return page.getByRole("button", { name: "삭제", exact: true });
}

// 홈 카드 제목은 제목으로 시작한다. board-list 테스트가 카드를 이렇게 찾으므로 새 글도 맞춘다
function newBoard(word) {
  const stamp = Date.now();
  return { title: `제목 ${word} ${stamp}`, content: `${word} 내용 ${stamp}` };
}

async function login(page, username) {
  await page.goto("/login-form");
  await page.getByPlaceholder("아이디").fill(username);
  await page.getByPlaceholder("비밀번호").fill("1234");

  const responded = page.waitForResponse(
    (res) => res.url() === LOGIN_API && res.request().method() === "POST",
    { timeout: 5000 },
  );
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await responded;
  await expect(page).toHaveURL(/5173\/$/);
}

// 시드 글을 바꾸지 않으려고 테스트마다 ssar의 새 글을 서버에 직접 만든다
async function createBoard(page, request, board) {
  const jwt = await page.evaluate(() => localStorage.getItem("jwt"));
  const res = await request.post(`${API}/api/boards`, {
    headers: { Authorization: jwt },
    data: board,
  });
  expect(res.status()).toBe(200);
  return (await res.json()).body.id;
}

// 수정 화면을 열고 상세 요청이 끝날 때까지 기다린다
async function openUpdateForm(page, id) {
  await page.goto(`/update-form/${id}`);
  await page.waitForLoadState("networkidle");
}

// React가 입력칸에 넘긴 value를 꺼낸다. 화면이 값을 기억하면 친 글자와 같다
function reactValue(locator) {
  return locator.evaluate((el) => {
    const key = Object.keys(el).find((k) => k.startsWith("__reactProps$"));
    return el[key].value;
  });
}

test("S1 상세에서 owner가 true인 글에만 수정, 삭제 버튼이 보인다", async ({
  page,
}) => {
  // 로그인 전에는 어느 글에도 보이지 않는다
  await page.goto("/board/1");
  await expect(heading(page, "제목1")).toBeVisible();
  await expect(editLink(page)).toHaveCount(0);
  await expect(deleteButton(page)).toHaveCount(0);

  // ssar로 로그인하면 ssar의 제목1에는 보이고 love의 제목4에는 보이지 않는다
  await login(page, "ssar");
  await page.goto("/board/1");
  await expect(heading(page, "제목1")).toBeVisible();
  await expect(editLink(page)).toBeVisible();
  await expect(deleteButton(page)).toBeVisible();

  await page.goto("/board/4");
  await expect(heading(page, "제목4")).toBeVisible();
  await expect(editLink(page)).toHaveCount(0);
  await expect(deleteButton(page)).toHaveCount(0);
});

test("S2 수정 화면에 들어가면 주소의 글 번호로 상세를 받아 제목과 내용 칸을 채운다", async ({
  page,
  request,
}) => {
  await login(page, "ssar");
  const board = newBoard("채우기");
  const id = await createBoard(page, request, board);

  await page.goto(`/update-form/${id}`);

  await expect(page.getByPlaceholder("제목")).toHaveValue(board.title);
  await expect(page.getByPlaceholder("내용")).toHaveValue(board.content);
});

test("S3 수정 화면에서 제목과 내용을 고치면 화면이 고친 값을 기억한다", async ({
  page,
  request,
}) => {
  await login(page, "ssar");
  const id = await createBoard(page, request, newBoard("기억"));
  const changed = newBoard("고친");

  await openUpdateForm(page, id);
  await page.getByPlaceholder("제목").fill(changed.title);
  await page.getByPlaceholder("내용").fill(changed.content);

  expect(await reactValue(page.getByPlaceholder("제목"))).toBe(changed.title);
  expect(await reactValue(page.getByPlaceholder("내용"))).toBe(changed.content);
});

test("S4 수정하기를 누르면 고친 제목과 내용을 서버에 보내고 그 글 상세로 간다", async ({
  page,
  request,
}) => {
  await login(page, "ssar");
  const id = await createBoard(page, request, newBoard("수정 전"));
  const changed = newBoard("수정 뒤");

  await openUpdateForm(page, id);
  await page.getByPlaceholder("제목").fill(changed.title);
  await page.getByPlaceholder("내용").fill(changed.content);

  const requested = page.waitForRequest(
    (req) => req.url() === `${API}/api/boards/${id}` && req.method() === "PUT",
    { timeout: 5000 },
  );
  await page.getByRole("button", { name: "수정하기", exact: true }).click();
  const req = await requested;
  expect(req.postDataJSON()).toEqual(changed);

  await expect(page).toHaveURL(new RegExp(`5173/board/${id}$`));
  await expect(heading(page, changed.title)).toBeVisible();
  await expect(page.getByText(changed.content, { exact: true })).toBeVisible();
});

test("S5 상세에서 삭제를 누르면 서버에서 글을 지우고 홈으로 간다", async ({
  page,
  request,
}) => {
  await login(page, "ssar");
  const board = newBoard("삭제");
  const id = await createBoard(page, request, board);

  await page.goto(`/board/${id}`);
  await expect(heading(page, board.title)).toBeVisible();

  const requested = page.waitForRequest(
    (req) =>
      req.url() === `${API}/api/boards/${id}` && req.method() === "DELETE",
    { timeout: 5000 },
  );
  await deleteButton(page).click();
  await requested;

  await expect(page).toHaveURL(/5173\/$/);
  await expect(page.getByRole("link", { name: /^제목/ }).first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: board.title, exact: true }),
  ).toHaveCount(0);
  const res = await request.get(`${API}/api/boards/${id}`);
  expect(res.status()).toBe(404);
});
