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
  return res.headers.get("authorization");
}
before(async () => {
  server = createApp().listen(0);
  await new Promise((r) => server.on("listening", r));
  base = `http://localhost:${server.address().port}`;
});
after(() => {
  if (server) server.close();
});
beforeEach(async () => { await resetDb(); });

test("댓글 작성 성공 시 owner=true, username 포함", async () => {
  const jwt = await login();
  const res = await fetch(base + "/api/replies", {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: jwt },
    body: JSON.stringify({ comment: "안녕", boardId: 1 }),
  });
  const json = await res.json();
  assert.equal(json.body.comment, "안녕");
  assert.equal(json.body.owner, true);
  assert.equal(json.body.username, "ssar");
});

test("남의 댓글 삭제는 403", async () => {
  const jwt = await login("ssar");     // id1
  // reply 4 는 cos(id2) 소유
  const res = await fetch(base + "/api/replies/4", {
    method: "DELETE", headers: { Authorization: jwt },
  });
  assert.equal(res.status, 403);
});
