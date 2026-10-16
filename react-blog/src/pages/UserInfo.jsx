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

  const { data: user, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await http.get("/api/user");
      return res.data.body;
    },
  });

  useEffect(() => {
    if (user) {
      reset({ username: user.username, email: user.email, password: "" });
    }
  }, [user, reset]);

  const updateUser = useMutation({
    mutationFn: (data) =>
      http.put("/api/user", { email: data.email, password: data.password }),
    onSuccess: (res) => {
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
      <Input readOnly {...register("username")} />
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
