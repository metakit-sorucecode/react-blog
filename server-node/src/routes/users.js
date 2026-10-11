import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, nextId } from "../db.js";
import { signToken, requireAuth } from "../auth.js";

export const usersRouter = Router();

// 회원가입
usersRouter.post("/join", async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ status: 400, msg: "입력값이 필요합니다", body: null });
  }
  if (db.data.users.some((u) => u.username === username)) {
    return res.status(400).json({ status: 400, msg: "이미 존재하는 유저네임입니다", body: null });
  }
  const user = {
    id: nextId("user"),
    username,
    password: bcrypt.hashSync(password, 10),
    email,
  };
  db.data.users.push(user);
  await db.write();
  res.json({ status: 200, msg: "성공", body: { id: user.id, username, email } });
});

// 로그인
usersRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = db.data.users.find((u) => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ status: 400, msg: "아이디 또는 비밀번호가 틀렸습니다", body: null });
  }
  const jwt = signToken(user);
  res
    .header("Authorization", "Bearer " + jwt)
    .json({ status: 200, msg: "성공", body: null });
});

// 내 정보 조회 (GET /api/user)
usersRouter.get("/api/user", requireAuth, (req, res) => {
  const user = db.data.users.find((u) => u.id === req.sessionUser.id);
  if (!user) {
    return res.status(404).json({ status: 404, msg: "유저를 찾을 수 없습니다", body: null });
  }
  res.json({
    status: 200,
    msg: "성공",
    body: { id: user.id, username: user.username, email: user.email },
  });
});

// 내 정보 수정 (PUT /api/user)
usersRouter.put("/api/user", requireAuth, async (req, res) => {
  const { email, password } = req.body;
  const user = db.data.users.find((u) => u.id === req.sessionUser.id);
  if (!user) {
    return res.status(404).json({ status: 404, msg: "유저를 찾을 수 없습니다", body: null });
  }
  if (email) user.email = email;
  if (password) user.password = bcrypt.hashSync(password, 10); // 빈 문자열이면 비번 유지
  await db.write();
  res.json({
    status: 200,
    msg: "성공",
    body: { id: user.id, username: user.username, email: user.email },
  });
});
