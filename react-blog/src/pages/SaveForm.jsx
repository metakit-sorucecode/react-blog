import { useState } from "react";
import FormCard from "../components/FormCard";
import Input from "../components/Input";

export default function SaveForm() {
  const [form, setForm] = useState({ title: "", content: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <FormCard title="글쓰기">
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
