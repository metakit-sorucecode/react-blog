import { useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../api/http";
import FormCard from "../components/FormCard";
import Input from "../components/Input";

export default function SaveForm() {
  const [form, setForm] = useState({ title: "", content: "" });
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await http.post("/api/boards", form);
    navigate("/");
  }

  return (
    <FormCard title="글쓰기" onSubmit={handleSubmit}>
      <Input
        name="title"
        placeholder="제목"
        value={form.title}
        onChange={handleChange}
      />
      <textarea
        className="textarea"
        name="content"
        placeholder="내용"
        value={form.content}
        onChange={handleChange}
      />
      <button className="btn">글쓰기</button>
    </FormCard>
  );
}
