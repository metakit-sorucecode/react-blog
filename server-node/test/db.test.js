import { test } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
process.env.NODE_ENV = "test";
const { resetDb, db, nextId } = await import("../src/db.js");

test("resetDb 는 시드 유저 3명과 게시글 4개를 만든다", async () => {
  await resetDb();
  assert.equal(db.data.users.length, 3);
  assert.equal(db.data.boards.length, 4);
  assert.equal(db.data.replies.length, 4);
  assert.equal(db.data.users[0].username, "ssar");
  assert.notEqual(db.data.users[0].password, "1234");
  assert.equal(bcrypt.compareSync("1234", db.data.users[0].password), true);
});

test("nextId 는 board 카운터를 5로 증가시킨다", async () => {
  await resetDb();
  assert.equal(nextId("board"), 5);
});
