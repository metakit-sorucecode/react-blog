import { Link, useParams } from "react-router-dom";
import ReplyItem from "../components/ReplyItem";

export default function Detail() {
  const { id } = useParams();

  const replies = [
    { id: 1, username: "cos", comment: "댓글1" },
    { id: 2, username: "love", comment: "댓글2" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">제목1</h1>
      <p>작성자 ssar</p>
      <p className="my-8">내용1</p>
      <div className="flex gap-2">
        <Link to={`/update-form/${id}`} className="btn">
          수정
        </Link>
        <button className="btn">삭제</button>
      </div>

      <hr className="my-8" />

      <h2 className="font-bold">댓글</h2>
      <ul className="list">
        {replies.map((reply) => (
          <ReplyItem
            key={reply.id}
            username={reply.username}
            comment={reply.comment}
          />
        ))}
      </ul>
      <form className="flex gap-2 mt-4">
        <input className="input flex-1" placeholder="댓글을 입력하세요" />
        <button className="btn">등록</button>
      </form>
    </div>
  );
}
