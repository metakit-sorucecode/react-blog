import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDummy } from "../../shared/dummy/DummyProvider";

export default function MyInfoForm() {
  const { me, updateMe } = useDummy();
  const navigate = useNavigate();
  const [email, setEmail] = useState(me?.email ?? "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (!me) {
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
    if (!email.includes("@")) next.email = "이메일 형식이 아닙니다";
    if (password && password.length < 2) next.password = "비밀번호는 2자 이상";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    updateMe({ email, password });
    navigate("/");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <h1 className="text-2xl font-bold">내정보 수정</h1>
      <div>
        <label className="label">아이디</label>
        <input className="input input-bordered w-full" value={me.username} readOnly />
      </div>
      <div>
        <label className="label">이메일</label>
        <input className="input input-bordered w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="label">새 비밀번호 (변경 시에만 입력)</label>
        <input type="password" className="input input-bordered w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
      </div>
      <button className="btn btn-primary">수정</button>
    </form>
  );
}
