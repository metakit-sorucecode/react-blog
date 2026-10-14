import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDummy } from "../../shared/dummy/DummyProvider";

export default function JoinForm() {
  const { join } = useDummy();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!form.username) next.username = "아이디를 입력하세요";
    if (form.password.length < 2) next.password = "비밀번호는 2자 이상";
    if (!form.email.includes("@")) next.email = "이메일 형식이 아닙니다";
    if (Object.keys(next).length === 0 && !join(form)) next.username = "이미 있는 아이디입니다";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    navigate("/login-form");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <h1 className="text-2xl font-bold">회원가입</h1>
      <div>
        <label className="label">아이디</label>
        <input name="username" className="input input-bordered w-full" value={form.username} onChange={handleChange} />
        {errors.username && <p className="text-error text-sm mt-1">{errors.username}</p>}
      </div>
      <div>
        <label className="label">비밀번호</label>
        <input name="password" type="password" className="input input-bordered w-full" value={form.password} onChange={handleChange} />
        {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
      </div>
      <div>
        <label className="label">이메일</label>
        <input name="email" type="email" className="input input-bordered w-full" value={form.email} onChange={handleChange} />
        {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
      </div>
      <button className="btn btn-primary">회원가입</button>
    </form>
  );
}
