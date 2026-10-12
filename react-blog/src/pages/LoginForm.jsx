import { useState } from "react";
import FormCard from "../components/FormCard";
import Input from "../components/Input";

export default function LoginForm() {
  const [form, setForm] = useState({ username: "", password: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <FormCard title="로그인">
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
      <button className="btn">로그인</button>
    </FormCard>
  );
}
