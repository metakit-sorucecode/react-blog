import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDummy } from "../../shared/dummy/DummyProvider";

export default function SaveForm() {
  const { isLogin, saveBoard } = useDummy();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});

  if (!isLogin) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500 mb-4">로그인이 필요합니다.</p>
        <Link to="/login-form" className="btn btn-primary btn-sm">로그인</Link>
      </div>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!title.trim()) next.title = "제목을 입력하세요";
    if (!content.trim()) next.content = "내용을 입력하세요";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    saveBoard({ title, content });
    navigate("/");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold">글쓰기</h1>
      <div>
        <label className="label">제목</label>
        <input className="input input-bordered w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
        {errors.title && <p className="text-error text-sm mt-1">{errors.title}</p>}
      </div>
      <div>
        <label className="label">내용</label>
        <textarea className="textarea textarea-bordered w-full" rows={5} value={content} onChange={(e) => setContent(e.target.value)} />
        {errors.content && <p className="text-error text-sm mt-1">{errors.content}</p>}
      </div>
      <button className="btn btn-primary">글등록</button>
    </form>
  );
}
