import { useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../api/http";
import BoardForm from "../components/BoardForm";

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
    <BoardForm
      title="글쓰기"
      buttonText="글쓰기"
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
