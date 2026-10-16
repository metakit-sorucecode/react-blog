import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "../api/http";
import FormCard from "../components/FormCard";
import Input from "../components/Input";
import Loading from "../components/Loading";
import Notice from "../components/Notice";

export default function UpdateForm() {
  const { id } = useParams();
  const { register, handleSubmit, reset } = useForm();
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
      reset({ title: board.title, content: board.content });
    }
  }, [board, reset]);

  const updateBoard = useMutation({
    mutationFn: (data) => http.put(`/api/boards/${id}`, data),
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

  function onSubmit(data) {
    updateBoard.mutate(data);
  }

  if (isPending) {
    return <Loading />;
  }

  if (board && !board.owner) {
    return (
      <Notice
        text="수정 권한이 없습니다"
        to={`/board/${id}`}
        label="글로 돌아가기"
      />
    );
  }

  return (
    <FormCard title="글 수정" onSubmit={handleSubmit(onSubmit)}>
      <Input placeholder="제목" {...register("title")} />
      <textarea
        className="textarea"
        placeholder="내용"
        {...register("content")}
      />
      <button className="btn">수정하기</button>
    </FormCard>
  );
}
