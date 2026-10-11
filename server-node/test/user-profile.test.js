import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
process.env.NODE_ENV = "test";
const { createApp } = await import("../src/app.js");
const { resetDb } = await import("../src/db.js");

let base;
let server;
async function login(username = "ssar", password = "1234") {
  const res = await fetch(base + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
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
beforeEach(async () => {
  await resetDb();
});

test("GET /api/user 는 로그인 유저의 id/username/email 을 반환하고 password 는 없다", async () => {
  const jwt = await login("ssar");
  const res = await fetch(base + "/api/user", { headers: { Authorization: jwt } });
  const json = await res.json();
  assert.equal(res.status, 200);
  assert.equal(json.body.username, "ssar");
  assert.equal(json.body.email, "ssar@nate.com");
  assert.equal(json.body.password, undefined);
});

test("GET /api/user 는 토큰 없으면 401", async () => {
  const res = await fetch(base + "/api/user");
  assert.equal(res.status, 401);
});

test("PUT /api/user 는 이메일을 수정하고 다시 조회해도 반영된다", async () => {
  const jwt = await login("ssar");
  const res = await fetch(base + "/api/user", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: jwt },
    body: JSON.stringify({ email: "new@nate.com", password: "" }),
  });
  const json = await res.json();
  assert.equal(res.status, 200);
  assert.equal(json.body.email, "new@nate.com");

  const check = await (
    await fetch(base + "/api/user", { headers: { Authorization: await login("ssar") } })
  ).json();
  assert.equal(check.body.email, "new@nate.com");
});

test("PUT /api/user 로 비밀번호를 바꾸면 새 비번으로 로그인된다", async () => {
  const jwt = await login("ssar");
  await fetch(base + "/api/user", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: jwt },
    body: JSON.stringify({ email: "ssar@nate.com", password: "5678" }),
  });
  const relogin = await login("ssar", "5678");
  assert.match(relogin, /^Bearer /);
});
