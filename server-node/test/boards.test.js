import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
process.env.NODE_ENV = "test";
const { createApp } = await import("../src/app.js");
const { resetDb } = await import("../src/db.js");

let base;
let server;
async function login(username = "ssar") {
  const res = await fetch(base + "/login", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password: "1234" }),
  });
  return res.headers.get("authorization"); // "Bearer xxx"
}
before(async () => {
  server = createApp().listen(0);
  await new Promise((r) => server.on("listening", r));
  base = `http://localhost:${server.address().port}`;
});
after(async () => {
  if (server) server.close();
});
beforeEach(async () => { await resetDb(); });

test("목록은 page size 3, id DESC", async () => {
  const json = await (await fetch(base + "/?page=0&keyword=")).json();
  assert.equal(json.body.boards.length, 3);
  assert.equal(json.body.boards[0].id, 4); // 최신
  assert.equal(json.body.totalPage, 2);
  assert.equal(json.body.isFirst, true);
});

test("keyword 필터", async () => {
  const json = await (await fetch(base + "/?page=0&keyword=제목1")).json();
  assert.equal(json.body.boards.length, 1);
  assert.equal(json.body.boards[0].title, "제목1");
});

test("내 글 상세는 owner=true", async () => {
  const jwt = await login();
  const json = await (await fetch(base + "/api/boards/1", { headers: { Authorization: jwt } })).json();
  assert.equal(json.body.owner, true);       // board 1 은 ssar(id1) 소유
  assert.equal(json.body.username, "ssar");
});

test("작성은 인증 필요, 성공 시 body.id 반환", async () => {
  const noAuth = await fetch(base + "/api/boards", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "t", content: "c" }),
  });
  assert.equal(noAuth.status, 401);

  const jwt = await login();
  const res = await fetch(base + "/api/boards", {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: jwt },
    body: JSON.stringify({ title: "새글", content: "새내용" }),
  });
  const json = await res.json();
  assert.equal(json.body.title, "새글");
  assert.ok(json.body.id > 4);
});

test("남의 글 삭제는 403", async () => {
  const jwt = await login(); // ssar(id1)
  const res = await fetch(base + "/api/boards/4", { // board4 는 love(id3) 소유
    method: "DELETE", headers: { Authorization: jwt },
  });
  assert.equal(res.status, 403);
});

test("비로그인 상세는 owner=false", async () => {
  const json = await (await fetch(base + "/api/boards/1")).json();
  assert.equal(json.body.owner, false);
});

test("다른 유저가 보면 owner=false", async () => {
  const jwt = await login("cos"); // board1 은 ssar 소유
  const json = await (await fetch(base + "/api/boards/1", { headers: { Authorization: jwt } })).json();
  assert.equal(json.body.owner, false);
});

test("남의 글 수정은 403", async () => {
  const jwt = await login("cos"); // board1 은 ssar 소유
  const res = await fetch(base + "/api/boards/1", {
    method: "PUT", headers: { "Content-Type": "application/json", Authorization: jwt },
    body: JSON.stringify({ title: "x", content: "y" }),
  });
  assert.equal(res.status, 403);
});

test("없는 글 조회는 404", async () => {
  const res = await fetch(base + "/api/boards/999");
  assert.equal(res.status, 404);
});

test("없는 글 수정은 404", async () => {
  const jwt = await login();
  const res = await fetch(base + "/api/boards/999", {
    method: "PUT", headers: { "Content-Type": "application/json", Authorization: jwt },
    body: JSON.stringify({ title: "x", content: "y" }),
  });
  assert.equal(res.status, 404);
});

test("내 글 삭제 후 조회는 404 (삭제 반영)", async () => {
  const jwt = await login(); // ssar, board1 소유
  const del = await fetch(base + "/api/boards/1", { method: "DELETE", headers: { Authorization: jwt } });
  assert.equal(del.status, 200);
  const get = await fetch(base + "/api/boards/1");
  assert.equal(get.status, 404);
});

test("제목/내용 없이 작성하면 400", async () => {
  const jwt = await login();
  const res = await fetch(base + "/api/boards", {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: jwt },
    body: JSON.stringify({ title: "제목만" }), // content 누락
  });
  assert.equal(res.status, 400);
});
