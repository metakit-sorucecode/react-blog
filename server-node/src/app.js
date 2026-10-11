import express from "express";
import cors from "cors";
import { usersRouter } from "./routes/users.js";
import { boardsRouter } from "./routes/boards.js";
import { repliesRouter } from "./routes/replies.js";

export function apiOk(body = null) {
  return { status: 200, msg: "성공", body };
}

export function createApp() {
  const app = express();
  app.use(
    cors({
      origin: "http://localhost:5173",
      exposedHeaders: ["Authorization"], // 프론트가 로그인 토큰 읽으려면 필수
    })
  );
  app.use(express.json());

  app.use("/", usersRouter);
  app.use("/", boardsRouter);
  app.use("/", repliesRouter);

  // 공통 에러 핸들러 (throw 된 {status,msg} 처리)
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ status, msg: err.msg || "서버 오류", body: null });
  });
  return app;
}
