import { useEffect, useState } from "react";
import http from "../api/http";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReplyItem from "../components/ReplyItem";

export default function Detail() {
  const { id } = useParams();
  const [board, setBoard] = useState({
    title: "",
    content: "",
    username: "",
    owner: false,
    replies: [],
  });
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  async function loadBoard() {
    const res = await http.get(`/api/boards/${id}`);
    setBoard(res.data.body);
  }

  useEffect(() => {
    loadBoard();
  }, [id]);

  async function handleDelete() {
    await http.delete(`/api/boards/${id}`);
    navigate("/");
  }

  async function handleReplySubmit(e) {
    e.preventDefault();
    await http.post("/api/replies", { boardId: id, comment });
    loadBoard();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">{board.title}</h1>
      <p>작성자 {board.username}</p>
      <p className="my-8">{board.content}</p>
      {board.owner && (
        <div className="flex gap-2">
          <Link to={`/update-form/${id}`} className="btn">
            수정
          </Link>
          <button className="btn" onClick={handleDelete}>
            삭제
          </button>
        </div>
      )}

      <hr className="my-8" />

      <h2 className="font-bold">댓글</h2>
      <ul className="list">
        {board.replies.map((reply) => (
          <ReplyItem
            key={reply.id}
            username={reply.username}
            comment={reply.comment}
            owner={reply.owner}
          />
        ))}
      </ul>
      <form className="flex gap-2 mt-4" onSubmit={handleReplySubmit}>
        <input
          className="input flex-1"
          placeholder="댓글을 입력하세요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="btn">등록</button>
      </form>
    </div>
  );
}
