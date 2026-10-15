import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "../api/http";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReplyItem from "../components/ReplyItem";

export default function Detail() {
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  // main.jsx에서 만든 캐시 저장소를 꺼낸다. 쓰기 뒤 캐시를 맞출 때 쓴다
  const queryClient = useQueryClient();

  // 글 상세를 캐시에서 꺼내 그린다
  const { data: board } = useQuery({
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
      // 상세 키를 무효화한다 (invalidateQueries)
      // 무효화하면 그 키는 stale이 되어 다시 받을 대상이 된다
      // 이 화면이 위 useQuery로 상세 키를 쓰고 있어서 지금 바로 다시 받는다
      // 목록에는 댓글이 없어서 목록 키는 건드리지 않는다
      queryClient.invalidateQueries({ queryKey: ["boards", "detail", id] });
    },
  });

  const deleteReply = useMutation({
    mutationFn: (replyId) => http.delete(`/api/replies/${replyId}`),
    onSuccess: () => {
      // 댓글 쓰기와 같다. 상세만 지금 바로 다시 받는다
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

  // 받기 전에는 board가 undefined라서 아무것도 그리지 않는다
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
