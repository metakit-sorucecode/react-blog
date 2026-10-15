import { useState } from "react";
import http from "../api/http";
import { useNavigate } from "react-router-dom";
import FormCard from "../components/FormCard";
import Input from "../components/Input";

export default function JoinForm() {
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await http.post("/join", form);
      alert("회원가입 완료");
      navigate("/login-form");
    } catch {
      // 실패 알림은 인터셉터가 토스트로 띄웠다. 여기서는 이동만 막는다
      // catch가 없으면 받아 줄 곳이 없는 에러가 콘솔에 Uncaught로 남는다
    }
  }

  return (
    <FormCard title="회원가입" onSubmit={handleSubmit}>
      <Input
        name="username"
        placeholder="아이디"
        value={form.username}
        onChange={handleChange}
      />
      <Input
        name="password"
        type="password"
        placeholder="비밀번호"
        value={form.password}
        onChange={handleChange}
      />
      <Input
        name="email"
        placeholder="이메일"
        value={form.email}
        onChange={handleChange}
      />
      <button className="btn">가입하기</button>
    </FormCard>
  );
}
