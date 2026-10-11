import { Router } from "express";
import { db, nextId } from "../db.js";
import { requireAuth, optionalAuth } from "../auth.js";

export const boardsRouter = Router();

const PAGE_SIZE = 3;

function username(userId) {
  return db.data.users.find((u) => u.id === userId)?.username ?? "";
}
function toReplyDto(reply, sessionUser) {
  return {
    id: reply.id,
    comment: reply.comment,
    userId: reply.userId,
    username: username(reply.userId),
    owner: sessionUser ? sessionUser.id === reply.userId : false,
  };
}

// 목록 (GET /) — page, keyword
boardsRouter.get("/", optionalAuth, (req, res) => {
  const page = Number(req.query.page ?? 0);
  const keyword = req.query.keyword ?? "";
  const filtered = db.data.boards
    .filter((b) => b.title.includes(keyword))
    .sort((a, b) => b.id - a.id); // id DESC
  const totalPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = page * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);
  res.json({
    status: 200,
    msg: "성공",
    body: {
      totalPage,
      number: page,
      isFirst: page === 0,
      isLast: start + PAGE_SIZE >= filtered.length,
      boards: pageItems.map((b) => ({ id: b.id, title: b.title })),
    },
  });
});

// 상세 (GET /api/boards/:id)
boardsRouter.get("/api/boards/:id", optionalAuth, (req, res) => {
  const id = Number(req.params.id);
  const board = db.data.boards.find((b) => b.id === id);
  if (!board) return res.status(404).json({ status: 404, msg: "게시글을 찾을 수 없습니다", body: null });
  const su = req.sessionUser;
  const replies = db.data.replies
    .filter((r) => r.boardId === id)
    .map((r) => toReplyDto(r, su));
  res.json({
    status: 200,
    msg: "성공",
    body: {
      id: board.id,
      title: board.title,
      content: board.content,
      userId: board.userId,
      username: username(board.userId),
      owner: su ? su.id === board.userId : false,
      replies,
    },
  });
});

// 작성 (POST /api/boards)
boardsRouter.post("/api/boards", requireAuth, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ status: 400, msg: "제목과 내용이 필요합니다", body: null });
  const board = { id: nextId("board"), title, content, userId: req.sessionUser.id };
  db.data.boards.push(board);
  await db.write();
  res.json({ status: 200, msg: "성공", body: { id: board.id, title, content } });
});

// 수정 (PUT /api/boards/:id)
boardsRouter.put("/api/boards/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const board = db.data.boards.find((b) => b.id === id);
  if (!board) return res.status(404).json({ status: 404, msg: "게시글을 찾을 수 없습니다", body: null });
  if (board.userId !== req.sessionUser.id) return res.status(403).json({ status: 403, msg: "권한이 없습니다", body: null });
  board.title = req.body.title;
  board.content = req.body.content;
  await db.write();
  res.json({ status: 200, msg: "성공", body: { id: board.id, title: board.title, content: board.content } });
});

// 삭제 (DELETE /api/boards/:id)
boardsRouter.delete("/api/boards/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const board = db.data.boards.find((b) => b.id === id);
  if (!board) return res.status(404).json({ status: 404, msg: "게시글을 찾을 수 없습니다", body: null });
  if (board.userId !== req.sessionUser.id) return res.status(403).json({ status: 403, msg: "권한이 없습니다", body: null });
  db.data.boards = db.data.boards.filter((b) => b.id !== id);
  db.data.replies = db.data.replies.filter((r) => r.boardId !== id);
  await db.write();
  res.json({ status: 200, msg: "성공", body: null });
});
