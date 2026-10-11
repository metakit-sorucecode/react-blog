import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDummy } from "../../shared/dummy/DummyProvider";

export default function LoginForm() {
  const { login } = useDummy();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) return setError("아이디와 비밀번호를 입력하세요");
    if (!login(username, password)) return setError("아이디 또는 비밀번호가 틀렸습니다");
    navigate("/");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <h1 className="text-2xl font-bold">로그인</h1>
      <div>
        <label className="label">아이디</label>
        <input className="input input-bordered w-full" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label className="label">비밀번호</label>
        <input type="password" className="input input-bordered w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error && <p className="text-error text-sm">{error}</p>}
      <button className="btn btn-primary">로그인</button>
      <p className="text-sm text-gray-500">테스트 계정: ssar / 1234</p>
    </form>
  );
}
