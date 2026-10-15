import { test, expect } from "@playwright/test";

const API = "http://localhost:8080";
const LOGIN_API = `${API}/login`;

// 다른 테스트가 함께 돌며 글을 더하므로 글 수와 페이지 수는 정해 두지 않는다
// 대신 서버가 돌려준 응답과 화면을 맞춰 본다

// 목록 요청인지 보고 page와 keyword를 꺼낸다. 목록이 아니면 null이다
function listParams(url) {
  const u = new URL(url);
  if (u.origin !== API || u.pathname !== "/" || !u.searchParams.has("page")) {
    return null;
  }
  return {
    page: u.searchParams.get("page"),
    keyword: u.searchParams.get("keyword") ?? "",
  };
}

function isList(url, page, keyword = "") {
  const p = listParams(url);
  return p !== null && p.page === String(page) && p.keyword === keyword;
}

// 이 페이지와 검색어의 목록 요청을 모은다
function collectLists(page, pageNo, keyword = "") {
  const reqs = [];
  page.on("request", (req) => {
    if (req.method() === "GET" && isList(req.url(), pageNo, keyword)) {
      reqs.push(req);
    }
  });
  return reqs;
}

// 이 페이지 목록의 다음 응답을 기다려 글 제목들을 돌려준다
async function waitListTitles(page, pageNo, keyword = "") {
  const res = await page.waitForResponse(
    (r) => r.request().method() === "GET" && isList(r.url(), pageNo, keyword),
    { timeout: 5000 },
  );
  const body = (await res.json()).body;
  return body.boards.map((b) => b.title);
}

// 홈 카드의 제목 링크. 헤더 메뉴 링크는 제목으로 시작하지 않는다
function cardLinks(page) {
  return page.getByRole("link", { name: /^제목/ });
}

function pageNumber(page) {
  return page.getByText(/^\d+ \/ \d+$/);
}

function button(page, name) {
  return page.getByRole("button", { name, exact: true });
}

function searchBox(page) {
  return page.getByPlaceholder("제목 검색");
}

// 로딩 표시는 글자도 역할도 없는 DaisyUI loading 표시라 클래스로 찾는다
function spinner(page) {
  return page.locator(".loading");
}

async function openHome(page) {
  const titles = waitListTitles(page, 0);
  await page.goto("/");
  const shown = await titles;
  await expect(cardLinks(page)).toHaveText(shown);
  return shown;
}

async function login(page) {
  await page.goto("/login-form");
  await page.getByPlaceholder("아이디").fill("ssar");
  await page.getByPlaceholder("비밀번호").fill("1234");
  const responded = page.waitForResponse(
    (res) => res.url() === LOGIN_API && res.request().method() === "POST",
    { timeout: 5000 },
  );
  await button(page, "로그인").click();
  await responded;
  await expect(page).toHaveURL(/5173\/$/);
  // 로그인 뒤 홈이 목록을 다 받을 때까지 기다린다. 그래야 다음 응답 기다리기가 이 응답을 잡지 않는다
  await expect(cardLinks(page).first()).toBeVisible();
}

// 시드 글을 바꾸지 않으려고 이 테스트만의 글을 서버에 직접 만든다
async function createBoard(request, title) {
  const loginRes = await request.post(LOGIN_API, {
    data: { username: "ssar", password: "1234" },
  });
  const jwt = loginRes.headers()["authorization"];
  const res = await request.post(`${API}/api/boards`, {
    headers: { Authorization: jwt },
    data: { title, content: `${title} 내용` },
  });
  expect(res.status()).toBe(200);
}

test("S1 홈 목록 아래에 이전, 다음 버튼과 쪽 번호를 보이고 첫 페이지에서는 이전이 막힌다", async ({
  page,
}) => {
  await openHome(page);

  await expect(pageNumber(page)).toHaveText(/^1 \/ \d+$/);
  await expect(button(page, "이전")).toBeDisabled();
  // 시드 글만 4개라 페이지는 늘 둘 이상이다
  await expect(button(page, "다음")).toBeEnabled();
});

test("S2 다음을 누르면 다음 페이지 글을 보이고 쪽 번호가 바뀌며 마지막 페이지에서는 다음이 막힌다", async ({
  page,
}) => {
  await openHome(page);

  const second = waitListTitles(page, 1);
  await button(page, "다음").click();
  await expect(cardLinks(page)).toHaveText(await second);
  await expect(pageNumber(page)).toHaveText(/^2 \/ \d+$/);
  await expect(button(page, "이전")).toBeEnabled();

  // 다음이 막힐 때까지 넘긴다
  for (let i = 0; i < 100; i++) {
    if (await button(page, "다음").isDisabled()) break;
    const text = await pageNumber(page).textContent();
    await button(page, "다음").click();
    await expect(pageNumber(page)).not.toHaveText(text);
  }
  await expect(button(page, "다음")).toBeDisabled();
  const [now, total] = (await pageNumber(page).textContent()).split(" / ");
  expect(now).toBe(total);
});

test("S3 이전을 누르면 앞 페이지 글을 보인다", async ({ page }) => {
  const first = await openHome(page);

  const second = waitListTitles(page, 1);
  await button(page, "다음").click();
  await expect(cardLinks(page)).toHaveText(await second);

  await button(page, "이전").click();
  await expect(cardLinks(page)).toHaveText(first);
  await expect(pageNumber(page)).toHaveText(/^1 \/ \d+$/);
});

test("S4 검색창에 칠 때마다 제목에 그 글자가 든 글만 보이고 검색어가 바뀌면 첫 페이지부터 보인다", async ({
  page,
  request,
}) => {
  const word = `검색${Date.now()}`;
  await createBoard(request, `제목 ${word}`);
  await openHome(page);

  // 2페이지에서 찾아도 첫 페이지부터 보인다
  const second = waitListTitles(page, 1);
  await button(page, "다음").click();
  await expect(cardLinks(page)).toHaveText(await second);

  const searched = waitListTitles(page, 0, word);
  await searchBox(page).fill(word);
  expect(await searched).toEqual([`제목 ${word}`]);
  await expect(cardLinks(page)).toHaveText([`제목 ${word}`]);
  await expect(pageNumber(page)).toHaveText("1 / 1");
});

test("S5 검색 결과가 없으면 목록 자리에 검색 결과가 없습니다를 보인다", async ({
  page,
}) => {
  await openHome(page);

  await searchBox(page).fill(`없는글${Date.now()}`);

  await expect(
    page.getByText("검색 결과가 없습니다", { exact: true }),
  ).toBeVisible();
  await expect(cardLinks(page)).toHaveCount(0);
  await expect(pageNumber(page)).toHaveText("1 / 1");
  await expect(button(page, "이전")).toBeDisabled();
  await expect(button(page, "다음")).toBeDisabled();
});

test("S6 새 목록을 받는 동안 이전 목록과 검색창이 그대로 보이고 검색창의 글자와 커서가 남는다", async ({
  page,
}) => {
  const first = await openHome(page);

  // 이제부터 가는 목록 요청을 붙잡아 둔다
  let release;
  const released = new Promise((resolve) => (release = resolve));
  await page.route(
    (u) => listParams(u.href) !== null,
    async (route) => {
      await released;
      await route.continue();
    },
  );

  // 다음을 눌러도 받는 동안 1페이지 목록이 그대로 있다
  await button(page, "다음").click();
  await page.waitForTimeout(300);
  await expect(spinner(page)).toHaveCount(0);
  await expect(cardLinks(page)).toHaveText(first);

  // 검색창에 쳐도 받는 동안 글자와 커서가 남아 이어서 칠 수 있다
  await searchBox(page).click();
  await page.keyboard.type("제");
  await page.waitForTimeout(300);
  await expect(spinner(page)).toHaveCount(0);
  await expect(searchBox(page)).toBeFocused();
  await page.keyboard.type("목");
  await expect(searchBox(page)).toHaveValue("제목");

  release();
  await page.unrouteAll({ behavior: "ignoreErrors" });
});

test("S7 페이지와 검색어마다 따로 캐시에 담아 1분 안에 본 페이지로 돌아가면 요청 없이 바로 보인다", async ({
  page,
}) => {
  const first = await openHome(page);
  const firstAgain = collectLists(page, 0);

  // 2페이지를 받은 뒤 1페이지로 돌아온다
  const second = waitListTitles(page, 1);
  await button(page, "다음").click();
  const secondTitles = await second;
  await expect(cardLinks(page)).toHaveText(secondTitles);
  await button(page, "이전").click();
  await expect(cardLinks(page)).toHaveText(first);

  // 검색했다가 지우면 빈 검색어의 1페이지로 돌아온다
  const word = `캐시${Date.now()}`;
  const searched = waitListTitles(page, 0, word);
  await searchBox(page).fill(word);
  await searched;
  await searchBox(page).fill("");
  await expect(cardLinks(page)).toHaveText(first);

  // 다시 2페이지로 가도 요청이 가지 않는다
  const secondAgain = collectLists(page, 1);
  await button(page, "다음").click();
  await expect(cardLinks(page)).toHaveText(secondTitles);

  await page.waitForTimeout(500);
  expect(firstAgain).toHaveLength(0);
  expect(secondAgain).toHaveLength(0);
});

test("S8 글을 쓰면 모든 페이지 캐시를 무효화해 다음을 누르면 다시 받은 2페이지를 보인다", async ({
  page,
}) => {
  await login(page);
  await openHome(page);

  // 2페이지를 받아 캐시에 둔다
  const second = waitListTitles(page, 1);
  await button(page, "다음").click();
  await expect(cardLinks(page)).toHaveText(await second);

  // 글을 쓰면 캐시에 있던 2페이지도 다시 받는다
  const secondTitles = [];
  page.on("response", async (res) => {
    if (res.request().method() !== "GET" || !isList(res.url(), 1)) return;
    try {
      const body = (await res.json()).body;
      secondTitles.splice(
        0,
        secondTitles.length,
        ...body.boards.map((b) => b.title),
      );
    } catch {
      // 화면을 옮기는 사이에 응답 본문이 사라지면 건너뛴다
    }
  });
  const title = `제목 무효화 ${Date.now()}`;
  await page.getByRole("link", { name: "글쓰기", exact: true }).click();
  await page.getByPlaceholder("제목").fill(title);
  await page.getByPlaceholder("내용").fill("무효화 내용");
  await button(page, "글쓰기").click();
  await expect(page).toHaveURL(/5173\/$/);
  await expect(cardLinks(page).first()).toHaveText(title);
  await expect.poll(() => secondTitles.length).toBeGreaterThan(0);

  await button(page, "다음").click();
  await expect(cardLinks(page)).toHaveText(secondTitles);
});
