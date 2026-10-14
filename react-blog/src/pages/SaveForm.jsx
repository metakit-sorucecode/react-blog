import { useState } from "react";
import BoardForm from "../components/BoardForm";

export default function SaveForm() {
  const [form, setForm] = useState({ title: "", content: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <BoardForm
      title="글쓰기"
      buttonText="글쓰기"
      form={form}
      onChange={handleChange}
    />
  );
}
