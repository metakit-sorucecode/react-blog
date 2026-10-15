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

  // 서버 데이터를 바꾸는 요청(쓰기)을 맡긴다
  // mutate()를 부르면 mutationFn을 실행하고, 성공하면 onSuccess를 실행한다
  // mutate(data)로 넘긴 폼 값이 mutationFn의 data로 들어온다
  const saveBoard = useMutation({
    mutationFn: (data) => http.post("/api/boards", data),
    onSuccess: async () => {
      // 목록 키를 무효화한다
      // 목록을 쓰는 화면이 지금 없어서 이 키는 inactive다. 화면에 떠 있는 useQuery가 쓰는 키가 active다
      // 다시 받을 범위(refetchType)의 기본값 "active"는 active인 키만 받는다. "all"을 줘서 안 보이는 목록도 지금 받게 한다
      // 다 받은 뒤 이동한다. 그래야 홈에 새 글이 빠진 옛 목록이 잠깐도 보이지 않는다
      await queryClient.invalidateQueries({
        queryKey: ["boards", "list"],
        refetchType: "all",
      });
      navigate("/");
    },
  });

  // data는 { title, content }다
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
