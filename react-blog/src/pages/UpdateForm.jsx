import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import http from "../api/http";
import FormCard from "../components/FormCard";
import Input from "../components/Input";

export default function UpdateForm() {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", content: "" });
  const navigate = useNavigate();

  useEffect(() => {
    async function loadBoard() {
      const res = await http.get(`/api/boards/${id}`);
      setForm({ title: res.data.body.title, content: res.data.body.content });
    }
    loadBoard();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await http.put(`/api/boards/${id}`, form);
    navigate(`/board/${id}`);
  }

  return (
    <FormCard title="글 수정" onSubmit={handleSubmit}>
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
      <button className="btn">수정하기</button>
    </FormCard>
  );
}
