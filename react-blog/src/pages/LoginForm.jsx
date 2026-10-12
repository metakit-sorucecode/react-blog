import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FormCard from "../components/FormCard";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

export default function LoginForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await axios.post("http://localhost:8080/login", form);
    const jwt = res.headers.authorization;
    login(jwt, form.username);
    navigate("/");
  }

  return (
    <FormCard title="로그인" onSubmit={handleSubmit}>
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
