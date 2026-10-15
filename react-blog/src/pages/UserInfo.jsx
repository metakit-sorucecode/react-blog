import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "../api/http";
import FormCard from "../components/FormCard";
import Input from "../components/Input";
import Loading from "../components/Loading";

export default function UserInfo() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 내 정보를 ["user"] 키로 캐시에서 꺼낸다
  // 캐시에 없거나 stale이면 서버에서 받는다
  const { data: user, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await http.get("/api/user");
      return res.data.body;
    },
  });

  // user가 캐시에서 오면 폼을 채운다. 새 비밀번호 칸은 비워 둔다
  // 아이디는 서버에 보내지 않는 값이라 폼에 넣지 않는다
  useEffect(() => {
    if (user) {
      reset({ email: user.email, password: "" });
    }
  }, [user, reset]);

  const updateUser = useMutation({
    // data는 { email, password }다
    mutationFn: (data) => http.put("/api/user", data),
    // res는 mutationFn이 돌려준 수정 응답이다
    onSuccess: (res) => {
      // 서버에 다시 묻지 않고 ["user"] 캐시를 이 값으로 바꾼다 (setQueryData)
      // 수정 응답 { id, username, email }이 조회 응답과 모양이 같아서 그대로 넣는다
      // 무효화해서 다시 받는 것보다 요청이 하나 준다
      queryClient.setQueryData(["user"], res.data.body);
      navigate("/");
    },
  });

  function onSubmit(data) {
    updateUser.mutate(data);
  }

  if (isPending) {
    return <Loading />;
  }

  return (
    <FormCard title="내 정보" onSubmit={handleSubmit(onSubmit)}>
      <Input value={user.username} readOnly />
      <Input placeholder="이메일" {...register("email")} />
      <Input
        type="password"
        placeholder="새 비밀번호"
        {...register("password")}
      />
      <button className="btn">수정하기</button>
    </FormCard>
  );
}
