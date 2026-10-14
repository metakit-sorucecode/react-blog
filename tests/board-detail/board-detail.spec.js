import { test, expect } from "@playwright/test";

const API = "http://localhost:8080";
const DETAIL_API = /localhost:8080\/api\/boards\/\d+$/;

async function firstPage(request) {
  const res = await request.get(`${API}/?page=0`);
  const boards = (await res.json()).body.boards;
  expect(boards.length).toBeGreaterThan(1);
  return boards;
}

async function detail(request, id) {
  const res = await request.get(`${API}/api/boards/${id}`);
  return (await res.json()).body;
}

// 댓글 줄. 헤더 메뉴도 목록이라 홈 링크가 없는 목록만 본다
function replyRows(page) {
  return page
    .getByRole("list")
    .filter({ hasNot: page.getByRole("link", { name: "홈", exact: true }) })
    .getByRole("listitem");
}

// 댓글이 있는 첫 페이지 글
// board-save 장부터 댓글 없는 새 글이 맨 위에 오므로 없으면 시드의 제목4(댓글 3개)로 본다
async function boardWithReplies(request) {
  const ids = (await firstPage(request)).map((b) => b.id);
  for (const id of [...ids, 4]) {
    const board = await detail(request, id);
    if (board.replies.length > 0) return board;
  }
  throw new Error("댓글이 있는 글이 없다");
}

test("S1 상세 주소에 들어가면 주소의 글 번호로 서버에서 상세(GET /api/boards/:id)를 받는다", async ({
  page,
  request,
}) => {
  const [first, second] = await firstPage(request);

  for (const { id } of [first, second]) {
    const requested = page.waitForRequest(
      (req) => req.url() === `${API}/api/boards/${id}`,
      { timeout: 5000 },
    );
    await page.goto(`/board/${id}`);
    await requested;
  }
});

test("S2 받은 제목, 작성자, 내용을 그린다", async ({ page, request }) => {
  const [first, second] = await firstPage(request);

  for (const { id } of [first, second]) {
    const board = await detail(request, id);
    await page.goto(`/board/${id}`);
    await expect(
      page.getByRole("heading", { name: board.title, exact: true }),
    ).toBeVisible();
    await expect(page.getByText(`작성자 ${board.username}`)).toBeVisible();
    await expect(page.getByText(board.content, { exact: true })).toBeVisible();
  }
});

test("S3 받은 댓글 목록을 작성자와 댓글로 그린다", async ({
  page,
  request,
}) => {
  const board = await boardWithReplies(request);
  await page.goto(`/board/${board.id}`);

  const rows = replyRows(page);
  await expect(rows).toHaveCount(board.replies.length);
  for (const [i, reply] of board.replies.entries()) {
    await expect(rows.nth(i)).toContainText(reply.username);
    await expect(rows.nth(i)).toContainText(reply.comment);
  }
});

test("S4 상세를 받기 전에는 예시 글자가 없고 제목, 내용, 댓글이 비어 있다", async ({
  page,
  request,
}) => {
  const board = await boardWithReplies(request);

  // 상세 응답을 붙잡아 두고 받기 전 화면을 본다
  let release;
  const gate = new Promise((resolve) => (release = resolve));
  await page.route(DETAIL_API, async (route) => {
    await gate;
    await route.continue();
  });

  await page.goto(`/board/${board.id}`);
  await expect(
    page.getByRole("link", { name: "홈", exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/제목\d/)).toHaveCount(0);
  await expect(page.getByText(/내용\d/)).toHaveCount(0);
  await expect(replyRows(page)).toHaveCount(0);

  release();
  await expect(
    page.getByRole("heading", { name: board.title, exact: true }),
  ).toBeVisible();
  await expect(replyRows(page)).toHaveCount(board.replies.length);
});

test("S5 수정 버튼을 누르면 그 글 번호의 수정 주소로 간다", async ({
  page,
}) => {
  // board-update-delete 장부터 수정 버튼은 내 글에만 보인다. ssar로 로그인해 ssar의 시드 글 둘로 본다
  await page.goto("/login-form");
  await page.getByPlaceholder("아이디").fill("ssar");
  await page.getByPlaceholder("비밀번호").fill("1234");
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page).toHaveURL(/5173\/$/);

  for (const id of [1, 2]) {
    await page.goto(`/board/${id}`);
    await page.getByRole("link", { name: "수정", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`5173/update-form/${id}$`));
  }
});
