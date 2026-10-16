import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import http from "../api/http";
import FormCard from "../components/FormCard";
import Input from "../components/Input";

export default function SaveForm() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const saveBoard = useMutation({
    mutationFn: (data) => http.post("/api/boards", data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["boards", "list"],
        refetchType: "all",
      });
      navigate("/");
    },
  });

  function onSubmit(data) {
    saveBoard.mutate(data);
  }

  return (
    <FormCard title="글쓰기" onSubmit={handleSubmit(onSubmit)}>
      <Input placeholder="제목" {...register("title")} />
      <textarea
        className="textarea"
        placeholder="내용"
        {...register("content")}
      />
      <button className="btn">글쓰기</button>
    </FormCard>
  );
}
