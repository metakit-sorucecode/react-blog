import { test, expect } from "@playwright/test";

const LIST_API = "http://localhost:8080/?page=0";

// 홈 카드의 제목 링크. 헤더 메뉴 링크는 제목으로 시작하지 않는다
function cardLinks(page) {
  return page.getByRole("link", { name: /^제목/ });
}

async function firstPage(request) {
  const res = await request.get(LIST_API);
  const boards = (await res.json()).body.boards;
  expect(boards.length).toBeGreaterThan(0);
  return boards;
}

test("S1 홈에 들어가면 서버에서 첫 페이지 글 목록(GET /?page=0)을 받아 카드로 그린다", async ({
  page,
  request,
}) => {
  const boards = await firstPage(request);
  await page.goto("/");
  await expect(cardLinks(page)).toHaveText(boards.map((b) => b.title));
});

test("S2 목록을 받기 전에는 카드가 하나도 없는 빈 목록이다", async ({
  page,
  request,
}) => {
  const boards = await firstPage(request);

  // 목록 응답을 붙잡아 두고 받기 전 화면을 본다
  let release;
  const gate = new Promise((resolve) => (release = resolve));
  // paging-search 장부터 홈은 목록을 keyword와 함께 요청한다
  await page.route(/localhost:8080\/\?page=0&keyword=$/, async (route) => {
    await gate;
    await route.continue();
  });

  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "홈", exact: true }),
  ).toBeVisible();
  await expect(cardLinks(page)).toHaveCount(0);

  release();
  await expect(cardLinks(page)).toHaveCount(boards.length);
});

test("S3 카드 제목을 누르면 그 글 번호의 상세 주소로 간다", async ({
  page,
  request,
}) => {
  const [first] = await firstPage(request);
  await page.goto("/");
  await page
    .getByRole("link", { name: first.title, exact: true })
    .click({ timeout: 5000 });
  await expect(page).toHaveURL(new RegExp(`5173/board/${first.id}$`));
});
