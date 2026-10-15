import { test, expect } from "@playwright/test";

const API = "http://localhost:8080";
const LOGIN_API = `${API}/login`;
const LIST_API = `${API}/?page=0`;
const USER_API = `${API}/api/user`;

function detailApi(id) {
  return `${API}/api/boards/${id}`;
}

// 캐시는 메모리에 있어서 page.goto로 새로 불러오면 사라진다
// 그래서 로그인 뒤 화면 이동은 메뉴, 링크, 뒤로 가기로만 한다
// networkidle은 페이지를 새로 불러올 때만 기다린다. 화면만 바꾼 뒤에는 settle로 기다린다

// 화면을 바꾼 뒤 요청이 나갈 틈을 준다. 로컬 요청은 수십 ms 안에 나간다
async function settle(page) {
  await page.waitForTimeout(1000);
}

function waitForGet(page, url) {
  return page.waitForResponse(
    (res) => res.url() === url && res.request().method() === "GET",
    { timeout: 5000 },
  );
}

// 홈 카드 제목은 제목으로 시작한다. board-list 테스트가 카드를 이렇게 찾으므로 새 글도 맞춘다
function newBoard(word) {
  const stamp = Date.now();
  return { title: `제목 ${word} ${stamp}`, content: `${word} 내용 ${stamp}` };
}

// 시드 계정의 이메일을 바꾸면 다른 장 테스트가 깨진다. 내 정보를 고칠 때는 새 사용자를 만든다
function newUser() {
  const username = `rq${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return { username, password: "1234", email: `${username}@nate.com` };
}

function menu(page, name) {
  return page.getByRole("link", { name, exact: true });
}

function heading(page, name) {
  return page.getByRole("heading", { name, exact: true });
}

async function login(page, username, password = "1234") {
  await page.goto("/login-form");
  await fillLogin(page, username, password);
}

// 로그아웃 뒤 캐시가 그대로인지 보려면 새로 불러오지 않고 헤더 메뉴로 로그인한다
async function loginInApp(page, username) {
  await menu(page, "로그인").click();
  await fillLogin(page, username, "1234");
}

async function fillLogin(page, username, password) {
  await page.getByPlaceholder("아이디").fill(username);
  await page.getByPlaceholder("비밀번호").fill(password);

  const responded = page.waitForResponse(
    (res) => res.url() === LOGIN_API && res.request().method() === "POST",
    { timeout: 5000 },
  );
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await responded;
  await expect(page).toHaveURL(/5173\/$/);
  await expect(page.getByText(`${username}님`, { exact: true })).toBeVisible();
}

// 시드 글을 바꾸지 않으려고 테스트마다 ssar의 새 글을 서버에 직접 만든다
async function createBoard(page, request, word) {
  const board = newBoard(word);
  const jwt = await page.evaluate(() => localStorage.getItem("jwt"));
  const res = await request.post(`${API}/api/boards`, {
    headers: { Authorization: jwt },
    data: board,
  });
  expect(res.status()).toBe(200);
  return { ...board, id: (await res.json()).body.id };
}

// 다른 테스트가 글을 더 만들면 새 글 카드가 홈 첫 페이지에서 밀린다
// 그래서 상세를 새로 불러온 뒤 홈 메뉴로 목록을 캐시에 담고 뒤로 가기로 상세에 돌아온다
async function openDetailWithList(page, board) {
  await page.goto(`/board/${board.id}`);
  await expect(heading(page, board.title)).toBeVisible();
  await page.waitForLoadState("networkidle");
  const listed = waitForGet(page, LIST_API);
  await menu(page, "홈").click();
  await expect(page).toHaveURL(/5173\/$/);
  await listed;
  await page.goBack();
  await expect(heading(page, board.title)).toBeVisible();
  await settle(page);
}

// 이 주소로 가는 GET 요청을 모은다
function collectGets(page, url) {
  const gets = [];
  page.on("request", (req) => {
    if (req.url() === url && req.method() === "GET") gets.push(req);
  });
  return gets;
}

// 이 주소로 가는 GET 요청을 release를 부를 때까지 붙잡는다
// 붙잡은 동안 어느 화면에 있는지 보면 받은 뒤 이동하는지 알 수 있다
async function holdGet(page, url) {
  let hit = false;
  let release;
  const released = new Promise((resolve) => (release = resolve));
  await page.route(
    (u) => u.href === url,
    async (route) => {
      if (route.request().method() !== "GET") return route.continue();
      hit = true;
      await released;
      await route.continue();
    },
  );
  return { hit: () => hit, release: () => release() };
}

async function openDevtools(page) {
  await page
    .getByRole("button", { name: "Open Tanstack query devtools" })
    .click();
}

async function closeDevtools(page) {
  await page
    .getByRole("button", { name: /close tanstack query devtools/i })
    .first()
    .click();
}

// Devtools는 쿼리 줄마다 aria-label에 키를 적는다. 예: Query key ["boards","list"]
function keyRow(page, key) {
  return page.locator(`[aria-label^='Query key ${JSON.stringify(key)}']`);
}

// 탭을 숨겼다가 다시 보일 때 브라우저가 보내는 이벤트를 낸다
async function showTabAgain(page) {
  await page.evaluate(() =>
    document.dispatchEvent(new Event("visibilitychange", { bubbles: true })),
  );
}

test("S1 화면 아래 구석에 서버 데이터 도구 버튼이 생기고 누르면 키 목록이 열린다", async ({
  page,
}) => {
  await page.goto("/");

  const button = page.getByRole("button", {
    name: "Open Tanstack query devtools",
  });
  await expect(button).toBeVisible();
  const box = await button.boundingBox();
  const viewport = page.viewportSize();
  expect(box.y).toBeGreaterThan(viewport.height / 2);

  await button.click();
  await expect(
    page.locator("[aria-label='Tanstack query devtools']"),
  ).toBeVisible();
  await expect(
    page
      .getByRole("button", { name: /close tanstack query devtools/i })
      .first(),
  ).toBeVisible();
});

test("S2 홈, 상세, 글 수정, 내 정보 화면이 받은 데이터를 키로 캐시에 담는다", async ({
  page,
  request,
}) => {
  await login(page, "ssar");
  const board = await createBoard(page, request, "키");

  await openDetailWithList(page, board);
  await page.getByRole("link", { name: "수정", exact: true }).click();
  await expect(page.getByPlaceholder("제목")).toHaveValue(board.title);
  await menu(page, "내 정보").click();
  await expect(page.getByPlaceholder("이메일")).toHaveValue("ssar@nate.com");

  await openDevtools(page);
  await expect(keyRow(page, ["boards", "list"])).toHaveCount(1);
  await expect(keyRow(page, ["user"])).toHaveCount(1);
  // 상세와 글 수정은 같은 키 하나를 함께 쓴다
  await expect(
    keyRow(page, ["boards", "detail", String(board.id)]),
  ).toHaveCount(1);
});

test("S3 1분 안에 홈으로 돌아오면 목록 요청 없이 바로 그린다", async ({
  page,
  request,
}) => {
  await login(page, "ssar");
  const board = await createBoard(page, request, "캐시");
  await openDetailWithList(page, board);

  const lists = collectGets(page, LIST_API);
  await menu(page, "홈").click();
  await expect(page).toHaveURL(/5173\/$/);
  await expect(page.getByRole("link", { name: /^제목/ }).first()).toBeVisible();
  await settle(page);

  expect(lists).toHaveLength(0);
});

test("S4 상세에서 수정을 누르면 상세 요청 없이 캐시로 제목과 내용을 채운다", async ({
  page,
  request,
}) => {
  await login(page, "ssar");
  const board = await createBoard(page, request, "채우기");
  await page.goto(`/board/${board.id}`);
  await expect(heading(page, board.title)).toBeVisible();
  await page.waitForLoadState("networkidle");

  const details = collectGets(page, detailApi(board.id));
  await page.getByRole("link", { name: "수정", exact: true }).click();
  await expect(page.getByPlaceholder("제목")).toHaveValue(board.title);
  await expect(page.getByPlaceholder("내용")).toHaveValue(board.content);
  await settle(page);

  expect(details).toHaveLength(0);
});

test("S5 탭이 다시 보이면 받은 지 1분이 지난 화면 데이터만 다시 받는다", async ({
  page,
}) => {
  await page.clock.install();
  await login(page, "ssar");
  await expect(page.getByRole("link", { name: /^제목/ }).first()).toBeVisible();
  await settle(page);

  const lists = collectGets(page, LIST_API);
  await showTabAgain(page);
  await page.waitForTimeout(1000);
  expect(lists).toHaveLength(0);

  await page.clock.fastForward("01:01");
  await showTabAgain(page);
  await expect.poll(() => lists.length).toBe(1);
});

test("S6 글쓰기를 하면 목록을 다시 받은 뒤 홈으로 가고 새 글이 맨 위에 보인다", async ({
  page,
}) => {
  await login(page, "ssar");
  await expect(page.getByRole("link", { name: /^제목/ }).first()).toBeVisible();
  await settle(page);
  const board = newBoard("글쓰기");

  await menu(page, "글쓰기").click();
  await page.getByPlaceholder("제목").fill(board.title);
  await page.getByPlaceholder("내용").fill(board.content);

  const list = await holdGet(page, LIST_API);
  await page.getByRole("button", { name: "글쓰기", exact: true }).click();

  // 목록을 받는 동안에는 아직 글쓰기 화면이다
  await expect.poll(list.hit).toBe(true);
  await expect(page).toHaveURL(/5173\/save-form$/);

  list.release();
  await expect(page).toHaveURL(/5173\/$/);
  // 다른 테스트가 동시에 글을 쓰면 맨 위 자리는 바뀐다. 맨 위 순서는 board-save 테스트가 본다
  await expect(
    page.getByRole("link", { name: board.title, exact: true }),
  ).toBeVisible();
});

test("S7 글을 고치면 상세와 목록을 다시 받고 상세를 받은 뒤 상세로 간다", async ({
  page,
  request,
}) => {
  await login(page, "ssar");
  const board = await createBoard(page, request, "수정 전");
  await openDetailWithList(page, board);
  await page.getByRole("link", { name: "수정", exact: true }).click();
  await expect(page.getByPlaceholder("제목")).toHaveValue(board.title);
  await settle(page);

  const changed = newBoard("수정 뒤");
  await page.getByPlaceholder("제목").fill(changed.title);
  await page.getByPlaceholder("내용").fill(changed.content);

  const detail = await holdGet(page, detailApi(board.id));
  const lists = collectGets(page, LIST_API);
  await page.getByRole("button", { name: "수정하기", exact: true }).click();

  // 상세를 받는 동안에는 아직 수정 화면이고, 보지 않는 목록도 바로 받는다
  await expect.poll(detail.hit).toBe(true);
  await expect.poll(() => lists.length).toBe(1);
  await expect(page).toHaveURL(new RegExp(`5173/update-form/${board.id}$`));

  detail.release();
  await expect(page).toHaveURL(new RegExp(`5173/board/${board.id}$`));
  await expect(heading(page, changed.title)).toBeVisible();
});

test("S8 글을 지우면 목록을 다시 받은 뒤 홈으로 가고 뒤로 가기로 지운 글에 가지 않는다", async ({
  page,
  request,
}) => {
  await login(page, "ssar");
  const board = await createBoard(page, request, "삭제");
  await openDetailWithList(page, board);

  const list = await holdGet(page, LIST_API);
  const details = collectGets(page, detailApi(board.id));
  await page.getByRole("button", { name: "삭제", exact: true }).click();

  // 목록을 받는 동안에는 아직 상세 화면이다
  await expect.poll(list.hit).toBe(true);
  await expect(page).toHaveURL(new RegExp(`5173/board/${board.id}$`));

  list.release();
  await expect(page).toHaveURL(/5173\/$/);
  await expect(page.getByRole("link", { name: /^제목/ }).first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: board.title, exact: true }),
  ).toHaveCount(0);

  // 지운 글 상세를 다시 요청하지 않는다
  await settle(page);
  expect(details).toHaveLength(0);

  // 방문 기록에서 지운 글 주소가 홈으로 바뀌었다
  await page.goBack();
  await expect(page).not.toHaveURL(new RegExp(`/board/${board.id}$`));
});

// S9 댓글 쓰기와 삭제는 앞 장과 동작이 같다. reply 장 테스트가 그대로 확인한다

test("S10 내 정보를 고치면 응답으로 캐시를 채워 다시 받지 않고 바뀐 이메일을 보인다", async ({
  page,
  request,
}) => {
  const user = newUser();
  const joined = await request.post(`${API}/join`, { data: user });
  expect(joined.status()).toBe(200);
  await login(page, user.username, user.password);

  await menu(page, "내 정보").click();
  await expect(page.getByPlaceholder("이메일")).toHaveValue(user.email);
  await settle(page);

  const email = `new-${user.email}`;
  await page.getByPlaceholder("이메일").fill(email);
  const users = collectGets(page, USER_API);
  await page.getByRole("button", { name: "수정하기", exact: true }).click();
  await expect(page).toHaveURL(/5173\/$/);
  await settle(page);
  expect(users).toHaveLength(0);

  // 서버 응답을 붙잡아도 캐시에 든 바뀐 이메일이 바로 보인다
  const userGet = await holdGet(page, USER_API);
  await menu(page, "내 정보").click();
  await expect(page.getByPlaceholder("이메일")).toHaveValue(email);
  userGet.release();
});

test("S11 로그아웃하면 캐시를 비워 다음 사람이 자기 내 정보를 본다", async ({
  page,
}) => {
  await login(page, "ssar");
  await menu(page, "내 정보").click();
  await expect(page.getByPlaceholder("이메일")).toHaveValue("ssar@nate.com");
  await settle(page);

  await page.getByRole("button", { name: "로그아웃", exact: true }).click();
  await expect(page).toHaveURL(/5173\/$/);

  await openDevtools(page);
  await expect(keyRow(page, ["user"])).toHaveCount(0);
  await closeDevtools(page);

  await loginInApp(page, "cos");
  await menu(page, "내 정보").click();
  await expect(page.getByPlaceholder("이메일")).toHaveValue("cos@nate.com");
});
