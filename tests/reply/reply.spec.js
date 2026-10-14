import { test, expect } from "@playwright/test";

const API = "http://localhost:8080";
const LOGIN_API = `${API}/login`;
const REPLY_API = `${API}/api/replies`;

// 댓글 줄. 헤더 메뉴도 목록이라 홈 링크가 없는 목록만 본다
function replyRows(page) {
  return page
    .getByRole("list")
    .filter({ hasNot: page.getByRole("link", { name: "홈", exact: true }) })
    .getByRole("listitem");
}

function trash(locator) {
  return locator.getByRole("button", { name: "🗑", exact: true });
}

function commentInput(page) {
  return page.getByPlaceholder("댓글을 입력하세요");
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

async function jwtOf(page) {
  return page.evaluate(() => localStorage.getItem("jwt"));
}

// 시드 글 4의 댓글을 바꾸지 않으려고 테스트마다 ssar의 새 글을 서버에 직접 만든다
// 홈 카드 제목은 제목으로 시작한다. board-list 테스트가 카드를 이렇게 찾으므로 새 글도 맞춘다
async function createBoard(page, request) {
  const stamp = Date.now();
  const res = await request.post(`${API}/api/boards`, {
    headers: { Authorization: await jwtOf(page) },
    data: { title: `제목 댓글 ${stamp}`, content: `댓글 글 내용 ${stamp}` },
  });
  expect(res.status()).toBe(200);
  return (await res.json()).body.id;
}

async function createReply(page, request, boardId, comment) {
  const res = await request.post(REPLY_API, {
    headers: { Authorization: await jwtOf(page) },
    data: { boardId, comment },
  });
  expect(res.status()).toBe(200);
  return (await res.json()).body.id;
}

// 상세를 열고 상세 요청이 끝날 때까지 기다린다
async function openDetail(page, id) {
  await page.goto(`/board/${id}`);
  await page.waitForLoadState("networkidle");
}

// React가 입력칸에 넘긴 value를 꺼낸다. 화면이 값을 기억하면 친 글자와 같다
function reactValue(locator) {
  return locator.evaluate((el) => {
    const key = Object.keys(el).find((k) => k.startsWith("__reactProps$"));
    return el[key].value;
  });
}

test("S1 상세에서 owner가 true인 댓글에만 휴지통 버튼이 보인다", async ({
  page,
}) => {
  // 로그인 전에는 어느 댓글에도 보이지 않는다
  await page.goto("/board/4");
  await expect(replyRows(page).filter({ hasText: "댓글3" })).toBeVisible();
  await expect(trash(page)).toHaveCount(0);

  // ssar로 로그인하면 ssar의 댓글1, 댓글2에는 보이고 cos의 댓글3에는 보이지 않는다
  await login(page, "ssar");
  await page.goto("/board/4");
  const rows = replyRows(page);
  await expect(rows.filter({ hasText: "댓글3" })).toBeVisible();
  await expect(trash(rows.filter({ hasText: "댓글1" }))).toBeVisible();
  await expect(trash(rows.filter({ hasText: "댓글2" }))).toBeVisible();
  await expect(trash(rows.filter({ hasText: "댓글3" }))).toHaveCount(0);
});

test("S2 댓글 입력칸에 쓰면 화면이 쓴 값을 기억한다", async ({
  page,
  request,
}) => {
  await login(page, "ssar");
  const id = await createBoard(page, request);

  await openDetail(page, id);
  await commentInput(page).fill("기억할 댓글");

  expect(await reactValue(commentInput(page))).toBe("기억할 댓글");
});

test("S3 등록을 누르면 글 번호와 댓글을 서버에 보내고 상세를 다시 받는다", async ({
  page,
  request,
}) => {
  await login(page, "ssar");
  const id = await createBoard(page, request);
  const comment = `새 댓글 ${Date.now()}`;

  await openDetail(page, id);
  await commentInput(page).fill(comment);

  const posted = page.waitForRequest(
    (req) => req.url() === REPLY_API && req.method() === "POST",
    { timeout: 5000 },
  );
  const reloaded = page.waitForRequest(
    (req) => req.url() === `${API}/api/boards/${id}` && req.method() === "GET",
    { timeout: 5000 },
  );
  await page.getByRole("button", { name: "등록", exact: true }).click();
  const req = await posted;
  expect(Number(req.postDataJSON().boardId)).toBe(id);
  expect(req.postDataJSON().comment).toBe(comment);
  await reloaded;

  // 새로고침 없이 목록 끝에 붙는다
  await expect(page).toHaveURL(new RegExp(`5173/board/${id}$`));
  const last = replyRows(page).last();
  await expect(last).toContainText("ssar");
  await expect(last).toContainText(comment);
});

test("S4 등록이 끝나면 댓글 입력칸이 빈다", async ({ page, request }) => {
  await login(page, "ssar");
  const id = await createBoard(page, request);
  const comment = `비울 댓글 ${Date.now()}`;

  await openDetail(page, id);
  await commentInput(page).fill(comment);
  await page.getByRole("button", { name: "등록", exact: true }).click();

  await expect(replyRows(page).filter({ hasText: comment })).toBeVisible();
  await expect(commentInput(page)).toHaveValue("");
});

test("S5 휴지통을 누르면 서버에서 그 댓글을 지우고 상세를 다시 받는다", async ({
  page,
  request,
}) => {
  await login(page, "ssar");
  const id = await createBoard(page, request);
  const comment = `지울 댓글 ${Date.now()}`;
  const replyId = await createReply(page, request, id, comment);

  await openDetail(page, id);
  const row = replyRows(page).filter({ hasText: comment });
  await expect(row).toBeVisible();

  const deleted = page.waitForRequest(
    (req) => req.url() === `${REPLY_API}/${replyId}` && req.method() === "DELETE",
    { timeout: 5000 },
  );
  await trash(row).click();
  await deleted;

  await expect(row).toHaveCount(0);
  const res = await request.get(`${API}/api/boards/${id}`);
  const replies = (await res.json()).body.replies;
  expect(replies.find((r) => r.id === replyId)).toBeUndefined();
});
