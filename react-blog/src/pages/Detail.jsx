import { Link } from "react-router-dom";

export default function Detail() {
  return (
    <div>
      <h1 className="text-2xl font-bold">제목1</h1>
      <p>작성자 ssar</p>
      <p className="my-8">내용1</p>
      <div className="flex gap-2">
        <Link to="/update-form/1" className="btn">
          수정
        </Link>
        <button className="btn">삭제</button>
      </div>

      <hr className="my-8" />

      <h2 className="font-bold">댓글</h2>
      <ul className="list">
        <li className="list-row">
          <span>cos</span>
          <span>댓글1</span>
          <button className="btn btn-ghost btn-xs">🗑</button>
        </li>
        <li className="list-row">
          <span>love</span>
          <span>댓글2</span>
          <button className="btn btn-ghost btn-xs">🗑</button>
        </li>
      </ul>
      <form className="flex gap-2 mt-4">
        <input className="input flex-1" placeholder="댓글을 입력하세요" />
        <button className="btn">등록</button>
      </form>
    </div>
  );
}
