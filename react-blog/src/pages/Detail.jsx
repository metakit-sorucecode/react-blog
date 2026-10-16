import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "../api/http";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReplyItem from "../components/ReplyItem";
import Loading from "../components/Loading";

export default function Detail() {
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: board, isPending } = useQuery({
    queryKey: ["boards", "detail", id],
    queryFn: async () => {
      const res = await http.get(`/api/boards/${id}`);
      return res.data.body;
    },
  });

  const deleteBoard = useMutation({
    mutationFn: () => http.delete(`/api/boards/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["boards", "list"],
        refetchType: "all",
      });
      navigate("/", { replace: true });
    },
  });

  const saveReply = useMutation({
    mutationFn: () => http.post("/api/replies", { boardId: id, comment }),
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["boards", "detail", id] });
    },
  });

  const deleteReply = useMutation({
    mutationFn: (replyId) => http.delete(`/api/replies/${replyId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards", "detail", id] });
    },
  });

  function handleDelete() {
    deleteBoard.mutate();
  }

  function handleReplySubmit(e) {
    e.preventDefault();
    saveReply.mutate();
  }

  function handleReplyDelete(replyId) {
    deleteReply.mutate(replyId);
  }

  if (isPending) {
    return <Loading />;
  }

  if (!board) {
    return null;
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
            onDelete={() => handleReplyDelete(reply.id)}
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
