import { test, expect } from "@playwright/test";

const LOGIN_API = "http://localhost:8080/login";
const SAVE_API = "http://localhost:8080/api/boards";
const LIST_API = "http://localhost:8080/?page=0";
const DETAIL_API = "http://localhost:8080/api/boards/1";

// 홈 카드 제목은 제목으로 시작한다. board-list 테스트가 카드를 이렇게 찾으므로 새 글도 맞춘다
function newBoard() {
  const stamp = Date.now();
  return { title: `제목 새 글 ${stamp}`, content: `새 내용 ${stamp}` };
}

function savedJwt(page) {
  return page.evaluate(() => localStorage.getItem("jwt"));
}

async function login(page) {
  await page.goto("/login-form");
  await page.getByPlaceholder("아이디").fill("ssar");
  await page.getByPlaceholder("비밀번호").fill("1234");

  const responded = page.waitForResponse(
    (res) => res.url() === LOGIN_API && res.request().method() === "POST",
    { timeout: 5000 },
  );
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await responded;
  await expect(page).toHaveURL(/5173\/$/);
}

async function fillSaveForm(page, board) {
  await page.goto("/save-form");
  await page.getByPlaceholder("제목").fill(board.title);
  await page.getByPlaceholder("내용").fill(board.content);
}

function saveButton(page) {
  return page.getByRole("button", { name: "글쓰기", exact: true });
}

// form-hook 장부터 입력값은 state가 아니라 입력칸이 기억한다 (react-hook-form)
// 그래서 React props의 value 대신 입력칸에 남은 값을 본다

test("S1 글쓰기 화면에서 제목과 내용을 입력하면 화면이 값을 기억한다", async ({
  page,
}) => {
  const board = newBoard();
  await fillSaveForm(page, board);

  await expect(page.getByPlaceholder("제목")).toHaveValue(board.title);
  await expect(page.getByPlaceholder("내용")).toHaveValue(board.content);
});

test("S2 로그인한 뒤 글쓰기를 누르면 제목과 내용을 로그인 토큰과 함께 서버에 보낸다", async ({
  page,
}) => {
  await login(page);
  const jwt = await savedJwt(page);
  const board = newBoard();
  await fillSaveForm(page, board);

  const requested = page.waitForRequest(
    (req) => req.url() === SAVE_API && req.method() === "POST",
    { timeout: 5000 },
  );
  await saveButton(page).click();
  const req = await requested;

  expect(req.postDataJSON()).toEqual(board);
  expect(req.headers()["authorization"]).toBe(jwt);
  const res = await req.response();
  expect(res.status()).toBe(200);
});

test("S3 글이 저장되면 홈으로 가고 새 글이 목록 맨 위에 보인다", async ({
  page,
}) => {
  await login(page);
  const board = newBoard();
  await fillSaveForm(page, board);

  await saveButton(page).click();

  await expect(page).toHaveURL(/5173\/$/);
  await expect(page.getByRole("link", { name: /^제목/ }).first()).toHaveText(
    board.title,
  );
});

test("S4 로그인한 뒤에는 앞에서 만든 글 목록과 상세 요청에도 토큰이 붙는다", async ({
  page,
}) => {
  await login(page);
  const jwt = await savedJwt(page);

  const listRequested = page.waitForRequest((req) => req.url() === LIST_API, {
    timeout: 5000,
  });
  await page.goto("/");
  const listReq = await listRequested;
  expect(listReq.headers()["authorization"]).toBe(jwt);

  const detailRequested = page.waitForRequest(
    (req) => req.url() === DETAIL_API,
    { timeout: 5000 },
  );
  await page.goto("/board/1");
  const detailReq = await detailRequested;
  expect(detailReq.headers()["authorization"]).toBe(jwt);
});
