import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
process.env.NODE_ENV = "test";
const { createApp } = await import("../src/app.js");
const { resetDb } = await import("../src/db.js");

let base;
let server;
before(async () => {
  server = createApp().listen(0);
  await new Promise((r) => server.on("listening", r));
  base = `http://localhost:${server.address().port}`;
});
after(async () => {
  if (server) server.close();
});
beforeEach(async () => { await resetDb(); });

test("로그인 성공 시 Authorization 헤더에 Bearer 토큰", async () => {
  const res = await fetch(base + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "ssar", password: "1234" }),
  });
  assert.equal(res.status, 200);
  assert.match(res.headers.get("authorization"), /^Bearer /);
});

test("회원가입 성공 시 body 에 id/username/email", async () => {
  const res = await fetch(base + "/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "newbie", password: "1234", email: "n@n.com" }),
  });
  const json = await res.json();
  assert.equal(json.body.username, "newbie");
  assert.ok(json.body.id > 3);
});

test("틀린 비밀번호는 400 과 msg", async () => {
  const res = await fetch(base + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "ssar", password: "wrong" }),
  });
  assert.equal(res.status, 400);
  assert.equal((await res.json()).msg, "아이디 또는 비밀번호가 틀렸습니다");
});

test("회원가입 응답 body 에 password 가 없다", async () => {
  const res = await fetch(base + "/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "nopw", password: "1234", email: "nopw@n.com" }),
  });
  const json = await res.json();
  assert.equal(json.body.password, undefined);
  assert.deepEqual(Object.keys(json.body).sort(), ["email", "id", "username"]);
});

test("중복 유저네임 가입은 400", async () => {
  const dup = { username: "ssar", password: "1234", email: "x@n.com" }; // ssar 는 시드 유저
  const res = await fetch(base + "/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dup),
  });
  assert.equal(res.status, 400);
});
