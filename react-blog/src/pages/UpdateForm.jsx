import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "../api/http";
import FormCard from "../components/FormCard";
import Input from "../components/Input";
import Loading from "../components/Loading";

export default function UpdateForm() {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", content: "" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: board, isPending } = useQuery({
    queryKey: ["boards", "detail", id],
    queryFn: async () => {
      const res = await http.get(`/api/boards/${id}`);
      return res.data.body;
    },
  });

  useEffect(() => {
    if (board) {
      setForm({ title: board.title, content: board.content });
    }
  }, [board]);

  const updateBoard = useMutation({
    mutationFn: () => http.put(`/api/boards/${id}`, form),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["boards", "list"],
        refetchType: "all",
      });
      await queryClient.invalidateQueries({
        queryKey: ["boards", "detail", id],
      });
      navigate(`/board/${id}`);
    },
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateBoard.mutate();
  }

  if (isPending) {
    return <Loading />;
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
