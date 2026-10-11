import { test } from "node:test";
import assert from "node:assert/strict";
import { signToken, requireAuth, optionalAuth } from "../src/auth.js";

function mockRes() {
  return {
    statusCode: 200,
    body: null,
    status(c) { this.statusCode = c; return this; },
    json(b) { this.body = b; return this; },
  };
}

test("유효한 토큰이면 req.sessionUser 를 세팅하고 next 호출", () => {
  const token = signToken({ id: 1, username: "ssar" });
  const req = { headers: { authorization: "Bearer " + token } };
  const res = mockRes();
  let called = false;
  requireAuth(req, res, () => (called = true));
  assert.equal(called, true);
  assert.equal(req.sessionUser.username, "ssar");
});

test("토큰 없으면 401", () => {
  const req = { headers: {} };
  const res = mockRes();
  requireAuth(req, res, () => {});
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.msg, "인증되지 않았습니다");
});

test("잘못된 토큰이면 던지지 않고 401", () => {
  const req = { headers: { authorization: "Bearer garbage.token.value" } };
  const res = mockRes();
  let threw = false;
  try { requireAuth(req, res, () => {}); } catch { threw = true; }
  assert.equal(threw, false);
  assert.equal(res.statusCode, 401);
});

test("optionalAuth 는 토큰 없거나 틀려도 next 호출 + sessionUser=null", () => {
  for (const authorization of [undefined, "Bearer garbage.token.value"]) {
    const req = { headers: authorization ? { authorization } : {} };
    let called = false;
    optionalAuth(req, mockRes(), () => (called = true));
    assert.equal(called, true);
    assert.equal(req.sessionUser, null);
  }
});
