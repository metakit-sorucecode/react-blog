import { test, expect } from "@playwright/test";

function heading(page, name) {
  return page.getByRole("heading", { name, exact: true });
}

function button(page, name) {
  return page.getByRole("button", { name, exact: true });
}

// board-update-delete 장부터 수정과 삭제 버튼은 내 글에만 보인다. 글쓴이로 로그인해서 본다
async function login(page, username) {
  await page.goto("/login-form");
  await page.getByPlaceholder("아이디").fill(username);
  await page.getByPlaceholder("비밀번호").fill("1234");
  await button(page, "로그인").click();
  await expect(page).toHaveURL(/5173\/$/);
}

test("S1 홈에 예시 글 카드 3개가 grid로 놓인다. 카드에는 제목1, 제목2, 제목3이 보인다", async ({
  page,
}) => {
  // board-list 장부터 카드 글자는 서버 첫 페이지 글 3개다. 세 칸 배치만 본다
  await page.goto("/");
  const cards = page.getByRole("link", { name: /^제목/ });
  await expect(cards).toHaveCount(3);
  const titles = [cards.nth(0), cards.nth(1), cards.nth(2)];

  // 한 줄에 세 칸으로 놓이면 높이가 같고 왼쪽에서 오른쪽으로 이어진다
  const boxes = [];
  for (const title of titles) {
    boxes.push(await title.boundingBox());
  }
  expect(Math.abs(boxes[0].y - boxes[1].y)).toBeLessThan(2);
  expect(Math.abs(boxes[1].y - boxes[2].y)).toBeLessThan(2);
  expect(boxes[0].x).toBeLessThan(boxes[1].x);
  expect(boxes[1].x).toBeLessThan(boxes[2].x);
});

test("S2 카드 제목을 누르면 상세 화면(/board/1)으로 간다", async ({ page }) => {
  // board-list 장부터 카드는 서버 글 번호의 상세 주소로 간다
  // board-detail 장부터 상세 제목은 누른 글의 제목이다
  await page.goto("/");
  const card = page.getByRole("link", { name: /^제목/ }).first();
  const title = await card.textContent();
  await card.click();
  await expect(page).toHaveURL(/5173\/board\/\d+$/);
  await expect(heading(page, title)).toBeVisible();
});

test("S3 상세 화면에 제목, 작성자, 내용, 수정과 삭제 버튼, 댓글 목록, 댓글 입력이 보인다", async ({
  page,
  request,
}) => {
  // board-detail 장부터 상세 글자는 서버에서 온다. 첫 페이지에서 댓글이 있는 글로 본다
  // board-save 장부터 댓글 없는 새 글이 맨 위에 오므로 없으면 시드의 제목4(댓글 3개)로 본다
  const list = await request.get("http://localhost:8080/?page=0");
  const ids = (await list.json()).body.boards.map((b) => b.id);
  let board;
  for (const id of [...ids, 4]) {
    const res = await request.get(`http://localhost:8080/api/boards/${id}`);
    board = (await res.json()).body;
    if (board.replies.length > 0) break;
  }
  expect(board.replies.length).toBeGreaterThan(0);

  await login(page, board.username);
  await page.goto(`/board/${board.id}`);
  await expect(heading(page, board.title)).toBeVisible();
  await expect(page.getByText(`작성자 ${board.username}`)).toBeVisible();
  await expect(page.getByText(board.content, { exact: true })).toBeVisible();
  // 수정은 상세에서 수정 화면으로 잇는 S4에서 링크가 된다. 여기서는 보이는지만 본다
  await expect(page.getByText("수정", { exact: true })).toBeVisible();
  await expect(button(page, "삭제")).toBeVisible();
  await expect(heading(page, "댓글")).toBeVisible();
  for (const reply of board.replies) {
    await expect(page.getByText(reply.comment, { exact: true })).toBeVisible();
  }
  // reply 장부터 휴지통은 로그인한 작성자의 댓글에만 보인다
  const mine = board.replies.filter((r) => r.username === board.username);
  await expect(button(page, "🗑")).toHaveCount(mine.length);
  await expect(page.getByPlaceholder("댓글을 입력하세요")).toBeVisible();
  await expect(button(page, "등록")).toBeVisible();
});

test("S4 상세의 수정 버튼을 누르면 수정 화면(/update-form/1)으로 간다", async ({
  page,
}) => {
  await login(page, "ssar");
  await page.goto("/board/1");
  await page.getByRole("link", { name: "수정", exact: true }).click();
  await expect(page).toHaveURL(/5173\/update-form\/1$/);
  await expect(heading(page, "글 수정")).toBeVisible();
});

test("S5 글쓰기 화면(/save-form)에 제목과 내용 입력칸, 글쓰기 버튼이 보인다", async ({
  page,
}) => {
  await page.goto("/save-form");
  await expect(heading(page, "글쓰기")).toBeVisible();
  await expect(page.getByPlaceholder("제목")).toBeVisible();
  await expect(page.getByPlaceholder("내용")).toBeVisible();
  await expect(button(page, "글쓰기")).toBeVisible();
});

test("S6 수정 화면에 제목과 내용 입력칸, 수정하기 버튼이 보인다", async ({
  page,
}) => {
  await page.goto("/update-form/1");
  await expect(heading(page, "글 수정")).toBeVisible();
  await expect(page.getByPlaceholder("제목")).toBeVisible();
  await expect(page.getByPlaceholder("내용")).toBeVisible();
  await expect(button(page, "수정하기")).toBeVisible();
});

test("S7 로그인 화면(/login-form)에 아이디와 비밀번호 입력칸, 로그인 버튼이 보인다", async ({
  page,
}) => {
  await page.goto("/login-form");
  await expect(heading(page, "로그인")).toBeVisible();
  await expect(page.getByPlaceholder("아이디")).toBeVisible();
  await expect(page.getByPlaceholder("비밀번호")).toHaveAttribute(
    "type",
    "password",
  );
  await expect(button(page, "로그인")).toBeVisible();
});

test("S8 회원가입 화면(/join-form)에 아이디, 비밀번호, 이메일 입력칸, 가입하기 버튼이 보인다", async ({
  page,
}) => {
  await page.goto("/join-form");
  await expect(heading(page, "회원가입")).toBeVisible();
  await expect(page.getByPlaceholder("아이디")).toBeVisible();
  await expect(page.getByPlaceholder("비밀번호")).toHaveAttribute(
    "type",
    "password",
  );
  await expect(page.getByPlaceholder("이메일")).toBeVisible();
  await expect(button(page, "가입하기")).toBeVisible();
});

test("S9 내 정보 화면(/user-info)에 아이디(읽기만), 이메일, 새 비밀번호 입력칸, 수정하기 버튼이 보인다", async ({
  page,
}) => {
  await page.goto("/user-info");
  await expect(heading(page, "내 정보")).toBeVisible();
  const username = page.getByRole("textbox").first();
  await expect(username).toHaveValue("ssar");
  await expect(username).not.toBeEditable();
  await expect(page.getByPlaceholder("이메일")).toBeVisible();
  await expect(page.getByPlaceholder("새 비밀번호")).toHaveAttribute(
    "type",
    "password",
  );
  await expect(button(page, "수정하기")).toBeVisible();
});

test("S10 헤더 메뉴를 누르면 각 화면이 헤더 아래에 보인다", async ({
  page,
}) => {
  // login 장부터 글쓰기와 내 정보 메뉴는 로그인 뒤에만 보인다. 그 두 메뉴는 tests/login이 본다
  const menus = [
    { name: "로그인", screen: heading(page, "로그인") },
    { name: "회원가입", screen: heading(page, "회원가입") },
    { name: "홈", screen: page.getByRole("link", { name: /^제목/ }).first() },
  ];

  // 홈에서 한 번 들어온 뒤 메뉴만 눌러 화면을 오간다
  await page.goto("/");
  for (const { name, screen } of menus) {
    const link = page.getByRole("link", { name, exact: true });
    await link.click();
    await expect(screen).toBeVisible();

    const linkBox = await link.boundingBox();
    const screenBox = await screen.boundingBox();
    expect(screenBox.y).toBeGreaterThan(linkBox.y + linkBox.height);
  }
});
