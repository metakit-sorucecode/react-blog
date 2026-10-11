import { Router } from "express";
import { db, nextId } from "../db.js";
import { requireAuth } from "../auth.js";

export const repliesRouter = Router();

function username(userId) {
  return db.data.users.find((u) => u.id === userId)?.username ?? "";
}

// 댓글 작성 (POST /api/replies)
repliesRouter.post("/api/replies", requireAuth, async (req, res) => {
  const { comment, boardId } = req.body;
  if (!comment) return res.status(400).json({ status: 400, msg: "댓글 내용이 필요합니다", body: null });
  const reply = {
    id: nextId("reply"),
    comment,
    boardId: Number(boardId),
    userId: req.sessionUser.id,
  };
  db.data.replies.push(reply);
  await db.write();
  res.json({
    status: 200, msg: "성공",
    body: {
      id: reply.id,
      comment: reply.comment,
      userId: reply.userId,
      username: username(reply.userId),
      owner: true, // 방금 내가 썼으므로
    },
  });
});

// 댓글 삭제 (DELETE /api/replies/:id)
repliesRouter.delete("/api/replies/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const reply = db.data.replies.find((r) => r.id === id);
  if (!reply) return res.status(404).json({ status: 404, msg: "댓글을 찾을 수 없습니다", body: null });
  if (reply.userId !== req.sessionUser.id) return res.status(403).json({ status: 403, msg: "권한이 없습니다", body: null });
  db.data.replies = db.data.replies.filter((r) => r.id !== id);
  await db.write();
  res.json({ status: 200, msg: "성공", body: null });
});
