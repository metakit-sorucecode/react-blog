import { useEffect, useState } from "react";
import http from "../api/http";
import FormCard from "../components/FormCard";
import Input from "../components/Input";

export default function UserInfo() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  useEffect(() => {
    async function loadUser() {
      const res = await http.get("/api/user");
      setForm({
        username: res.data.body.username,
        email: res.data.body.email,
        password: "",
      });
    }
    loadUser();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <FormCard title="내 정보">
      <Input value={form.username} readOnly />
      <Input
        name="email"
        placeholder="이메일"
        value={form.email}
        onChange={handleChange}
      />
      <Input
        name="password"
        type="password"
        placeholder="새 비밀번호"
        value={form.password}
        onChange={handleChange}
      />
      <button className="btn">수정하기</button>
    </FormCard>
  );
}
