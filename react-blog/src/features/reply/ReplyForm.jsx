import { useState } from "react";
import { Link } from "react-router-dom";
import { useDummy } from "../../shared/dummy/DummyProvider";

export default function ReplyForm({ boardId }) {
  const { isLogin, saveReply } = useDummy();
  const [comment, setComment] = useState("");

  if (!isLogin) {
    return (
      <div className="card bg-base-100 shadow mb-4">
        <div className="card-body flex-row items-center justify-between">
          <p className="text-gray-500">댓글을 쓰려면 로그인하세요.</p>
          <Link to="/login-form" className="btn btn-primary btn-sm">로그인</Link>
        </div>
      </div>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    saveReply({ comment, boardId });
    setComment("");
  }

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow mb-4">
      <div className="card-body">
        <textarea
          className="textarea textarea-bordered w-full"
          rows={3}
          placeholder="댓글을 입력하세요..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="card-actions justify-end">
          <button className="btn btn-primary btn-sm">댓글 작성</button>
        </div>
      </div>
    </form>
  );
}
