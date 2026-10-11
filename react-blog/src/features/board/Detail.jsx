import { Link, useNavigate, useParams } from "react-router-dom";
import { useDummy } from "../../shared/dummy/DummyProvider";
import ReplyForm from "../reply/ReplyForm";
import ReplyItem from "../reply/ReplyItem";

export default function Detail() {
  const { id } = useParams();
  const { getBoard, deleteBoard } = useDummy();
  const navigate = useNavigate();
  const board = getBoard(id);

  function remove() {
    deleteBoard(board.id);
    navigate("/");
  }

  if (!board) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500 mb-4">게시글이 없습니다.</p>
        <Link to="/" className="btn btn-primary btn-sm">목록으로</Link>
      </div>
    );
  }

  return (
    <div>
      {board.owner && (
        <div className="flex gap-2 mb-4">
          <Link to={`/update-form/${board.id}`} className="btn btn-warning btn-sm">수정</Link>
          <button className="btn btn-error btn-sm" onClick={remove}>삭제</button>
        </div>
      )}
      <h1 className="text-2xl font-bold">{board.title}</h1>
      <p className="text-sm text-gray-500 mt-1">작성자 {board.username}</p>
      <div className="divider" />
      <p className="min-h-[120px] whitespace-pre-wrap">{board.content}</p>
      <div className="divider" />

      <ReplyForm boardId={board.id} />

      <div className="mt-4">
        {board.replies.map((reply) => (
          <ReplyItem key={reply.id} reply={reply} />
        ))}
      </div>
    </div>
  );
}
