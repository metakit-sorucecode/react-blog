import { test, expect } from "@playwright/test";

const API = "http://localhost:8080";
const LOGIN_API = `${API}/login`;
const LIST_API = `${API}/?page=0`;
const USER_API = `${API}/api/user`;

function detailApi(id) {
  return `${API}/api/boards/${id}`;
}

// 다시 묻기 사이의 기다림은 기본값으로 1초, 2초, 4초다
// 3.5초면 기본값(3번)은 요청이 3개, 한 번만 다시 묻으면 2개다
const RETRY_WAIT = 3500;

// 로딩 표시는 글자도 역할도 없는 DaisyUI loading 표시라 클래스로 찾는다
function spinner(page) {
  return page.locator(".loading");
}

function heading(page, name) {
  return page.getByRole("heading", { name, exact: true });
}

function newBoard(word) {
  const stamp = Date.now();
  return { title: `제목 ${word} ${stamp}`, content: `${word} 내용 ${stamp}` };
}

async function login(page, username, password = "1234") {
  await page.goto("/login-form");
  await page.getByPlaceholder("아이디").fill(username);
  await page.getByPlaceholder("비밀번호").fill(password);
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(page.getByText(`${username}님`, { exact: true })).toBeVisible();
}

// 시드 글을 바꾸지 않으려고 ssar의 새 글을 서버에 직접 만든다
async function createSsarBoard(request, word) {
  const loginRes = await request.post(LOGIN_API, {
    data: { username: "ssar", password: "1234" },
  });
  const jwt = loginRes.headers()["authorization"];
  const board = newBoard(word);
  const res = await request.post(`${API}/api/boards`, {
    headers: { Authorization: jwt },
    data: board,
  });
  expect(res.status()).toBe(200);
  return { ...board, id: (await res.json()).body.id };
}

// 이 주소로 가는 GET 요청을 release를 부를 때까지 붙잡는다
async function holdGet(page, url) {
  let release;
  const released = new Promise((resolve) => (release = resolve));
  const matcher = (u) => u.href === url;
  await page.route(matcher, async (route) => {
    if (route.request().method() !== "GET") return route.continue();
    await released;
    await route.continue();
  });
  // 다 본 뒤 붙잡기를 푼다. unroute에는 route에 넘긴 함수를 그대로 넘겨야 풀린다
  return {
    release: () => release(),
    unhold: () => page.unroute(matcher),
  };
}

// 이 주소로 가는 GET 요청 수를 센다
function countGets(page, url) {
  const gets = [];
  page.on("request", (req) => {
    if (req.url() === url && req.method() === "GET") gets.push(req);
  });
  return gets;
}

// 브라우저에서 서버(8080)로 가는 요청을 모두 연결 실패로 만든다
async function cutServer(page) {
  await page.route(
    (u) => u.origin === API,
    (route) => route.abort("connectionrefused"),
  );
}

// 처리하지 못한 에러(Uncaught)를 모은다
function collectPageErrors(page) {
  const errors = [];
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

// 받는 동안 로딩 표시가 보이고, 받은 뒤 사라지고 내용이 보이는지 본다
async function expectLoadingThen(page, path, url, content) {
  const hold = await holdGet(page, url);
  await page.goto(path);
  await expect(spinner(page)).toBeVisible();
  hold.release();
  await expect(content()).toBeVisible();
  await expect(spinner(page)).toHaveCount(0);
  await hold.unhold();
}

test("S1 홈, 상세, 글 수정, 내 정보 화면이 데이터를 받는 동안 로딩 표시를 보인다", async ({
  page,
  request,
}) => {
  const board = await createSsarBoard(request, "로딩");
  await login(page, "ssar");

  await expectLoadingThen(page, "/", LIST_API, () =>
    page.getByRole("link", { name: /^제목/ }).first(),
  );
  await expectLoadingThen(page, `/board/${board.id}`, detailApi(board.id), () =>
    heading(page, board.title),
  );
  await expectLoadingThen(
    page,
    `/update-form/${board.id}`,
    detailApi(board.id),
    () => heading(page, "글 수정"),
  );
  await expectLoadingThen(page, "/user-info", USER_API, () =>
    heading(page, "내 정보"),
  );
});

test("S2 없는 글 상세에 들어가면 게시글이 없다는 안내와 목록 링크를 바로 보이고 토스트는 뜨지 않는다", async ({
  page,
}) => {
  const gets = countGets(page, detailApi(9999));
  await page.goto("/board/9999");

  // 다시 묻지 않으니 기다림 없이 보인다
  await expect(
    page.getByText("게시글이 없습니다", { exact: true }),
  ).toBeVisible({ timeout: 1500 });
  // 서버 msg를 토스트로 띄우지 않는다
  // 토스트는 4초 뒤 사라진다. toHaveCount(0)는 0이 될 때까지 기다려 사라진 뒤에 통과할 수 있다
  // 그래서 0.5초 뒤 그때의 개수를 한 번만 센다
  await page.waitForTimeout(500);
  expect(await page.getByText("게시글을 찾을 수 없습니다").count()).toBe(0);
  await page.waitForTimeout(RETRY_WAIT);
  expect(gets).toHaveLength(1);

  await page.getByRole("link", { name: "목록으로", exact: true }).click();
  await expect(page).toHaveURL(/5173\/$/);
});

test("S3 이미 있는 아이디로 가입하면 이유를 토스트로 보이고 회원가입 화면에 남는다", async ({
  page,
}) => {
  const errors = collectPageErrors(page);
  let dialogShown = false;
  page.on("dialog", (dialog) => {
    dialogShown = true;
    dialog.accept();
  });

  await page.goto("/join-form");
  await page.getByPlaceholder("아이디").fill("ssar");
  await page.getByPlaceholder("비밀번호").fill("1234");
  await page.getByPlaceholder("이메일").fill("ssar@nate.com");
  await page.getByRole("button", { name: "가입하기", exact: true }).click();

  await expect(
    page.getByText("이미 존재하는 유저네임입니다", { exact: true }),
  ).toBeVisible();
  await page.waitForTimeout(500);
  await expect(page).toHaveURL(/\/join-form$/);
  expect(dialogShown).toBe(false);
  expect(errors).toEqual([]);
});

test("S4 비밀번호가 틀린 채 로그인하면 이유를 토스트로 보이고 로그인 화면에 남는다", async ({
  page,
}) => {
  const errors = collectPageErrors(page);

  await page.goto("/login-form");
  await page.getByPlaceholder("아이디").fill("ssar");
  await page.getByPlaceholder("비밀번호").fill("틀린비밀번호");
  await page.getByRole("button", { name: "로그인", exact: true }).click();

  await expect(
    page.getByText("아이디 또는 비밀번호가 틀렸습니다", { exact: true }),
  ).toBeVisible();
  await page.waitForTimeout(500);
  await expect(page).toHaveURL(/\/login-form$/);
  await expect(page.getByText("ssar님", { exact: true })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("S5 남의 글 수정 화면에서 수정하기를 누르면 권한이 없다는 토스트를 보이고 수정 화면에 남는다. 그 밖의 쓰기 실패도 이유를 토스트로 보인다", async ({
  page,
  request,
}) => {
  const board = await createSsarBoard(request, "권한");
  await login(page, "cos");

  await page.goto(`/update-form/${board.id}`);
  await expect(page.getByPlaceholder("제목")).toHaveValue(board.title);
  await page.getByPlaceholder("제목").fill("cos가 고친 제목");
  await page.getByRole("button", { name: "수정하기", exact: true }).click();

  await expect(
    page.getByText("권한이 없습니다", { exact: true }),
  ).toBeVisible();
  await page.waitForTimeout(500);
  await expect(page).toHaveURL(new RegExp(`/update-form/${board.id}$`));

  // 그 밖의 쓰기 실패: 빈 글쓰기는 서버가 400과 이유를 보낸다
  await page.getByRole("link", { name: "글쓰기", exact: true }).click();
  await page.getByRole("button", { name: "글쓰기", exact: true }).click();
  await expect(
    page.getByText("제목과 내용이 필요합니다", { exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/save-form$/);
});

test("S6 서버에 연결할 수 없으면 조회든 쓰기든 서버에 연결할 수 없다는 토스트가 한 번 뜬다", async ({
  page,
}) => {
  const message = () =>
    page.getByText("서버에 연결할 수 없습니다", { exact: true });
  await cutServer(page);

  // 조회: 홈 목록. 한 번 더 묻더라도 토스트는 하나다
  await page.goto("/");
  await expect(message()).toBeVisible();
  await page.waitForTimeout(RETRY_WAIT);
  // toHaveCount는 맞을 때까지 기다린다. 토스트 2개 중 하나가 먼저 사라져도 통과하니 한 번만 센다
  expect(await message().count()).toBe(1);

  // 쓰기: 로그인
  await page.goto("/login-form");
  await page.getByPlaceholder("아이디").fill("ssar");
  await page.getByPlaceholder("비밀번호").fill("1234");
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await expect(message()).toBeVisible();
  expect(await message().count()).toBe(1);
  await expect(page).toHaveURL(/\/login-form$/);
});

test("S7 조회가 500이나 연결 실패면 한 번만 다시 묻고 400대면 다시 묻지 않는다", async ({
  page,
}) => {
  // 500: 목록 조회
  const listGets = countGets(page, LIST_API);
  const listMatcher = (u) => u.href === LIST_API;
  await page.route(listMatcher, (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ status: 500, msg: "서버 오류", body: null }),
    }),
  );
  await page.goto("/");
  await page.waitForTimeout(RETRY_WAIT);
  expect(listGets).toHaveLength(2);
  await page.unroute(listMatcher);

  // 연결 실패: 상세 조회
  const detailGets = countGets(page, detailApi(1));
  const detailMatcher = (u) => u.href === detailApi(1);
  await page.route(detailMatcher, (route) => route.abort("connectionrefused"));
  await page.goto("/board/1");
  await page.waitForTimeout(RETRY_WAIT);
  expect(detailGets).toHaveLength(2);
  await page.unroute(detailMatcher);

  // 400대: 없는 글 404
  const missingGets = countGets(page, detailApi(9999));
  await page.goto("/board/9999");
  await page.waitForTimeout(RETRY_WAIT);
  expect(missingGets).toHaveLength(1);
});

test("S8 없는 주소에 들어가면 헤더 아래에 페이지를 찾을 수 없다는 안내와 홈 링크를 보인다", async ({
  page,
}) => {
  await page.goto("/abc");

  await expect(
    page.getByRole("link", { name: "홈", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("페이지를 찾을 수 없습니다", { exact: true }),
  ).toBeVisible();

  await page.getByRole("link", { name: "홈으로", exact: true }).click();
  await expect(page).toHaveURL(/5173\/$/);
});
