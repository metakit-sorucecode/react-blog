import { useState } from "react";
import axios from "axios";
import FormCard from "../components/FormCard";
import Input from "../components/Input";

export default function JoinForm() {
  const [form, setForm] = useState({ username: "", password: "", email: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await axios.post("http://localhost:8080/join", form);
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
