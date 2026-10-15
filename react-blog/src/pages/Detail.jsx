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
  // main.jsx에서 만든 캐시 저장소를 꺼낸다. 쓰기 뒤 캐시를 맞출 때 쓴다
  const queryClient = useQueryClient();

  // 글 상세를 캐시에서 꺼내 그린다
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
      // 목록 키를 무효화한다
      // 목록을 쓰는 화면이 없어 inactive라 "all"로 지금 받게 한다
      // 다 받은 뒤 이동한다. 그래야 홈에 지운 글이 잠깐도 보이지 않는다
      await queryClient.invalidateQueries({
        queryKey: ["boards", "list"],
        refetchType: "all",
      });
      // 방문 기록의 지운 글 주소를 홈으로 바꾼다 (replace)
      // 그래서 뒤로 가기를 눌러도 지운 글로 돌아가지 않는다
      // 지운 글의 상세 캐시는 볼 화면이 없어서 gcTime(기본 5분)이 지나면 저절로 사라진다
      // removeQueries로 바로 빼지 않는다. 삭제 요청이 성공 상태로 바뀌며 이 화면이 이동 전에 한 번 더 그려지고, 그때 빈 키를 보고 상세를 다시 요청한다
      navigate("/", { replace: true });
    },
  });

  // 댓글 쓰기와 삭제도 useMutation에 맡긴다. 성공 뒤 할 일을 onSuccess 한 곳에 모은다
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

  // 훅을 모두 부른 뒤에 돌려준다. 훅은 매번 같은 순서로 불려야 한다
  if (isPending) {
    return <Loading />;
  }

  // 실패하면 board가 undefined라서 아무것도 그리지 않는다
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
