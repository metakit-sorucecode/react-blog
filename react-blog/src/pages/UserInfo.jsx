import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "../api/http";
import FormCard from "../components/FormCard";
import Input from "../components/Input";

export default function UserInfo() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 내 정보를 ["user"] 키로 캐시에서 꺼낸다
  // 캐시에 없거나 stale이면 서버에서 받는다
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await http.get("/api/user");
      return res.data.body;
    },
  });

  // user가 캐시에서 오면 폼을 채운다. 새 비밀번호 칸은 비워 둔다
  useEffect(() => {
    if (user) {
      setForm({ username: user.username, email: user.email, password: "" });
    }
  }, [user]);

  const updateUser = useMutation({
    mutationFn: () =>
      http.put("/api/user", { email: form.email, password: form.password }),
    // res는 mutationFn이 돌려준 수정 응답이다
    onSuccess: (res) => {
      // 서버에 다시 묻지 않고 ["user"] 캐시를 이 값으로 바꾼다 (setQueryData)
      // 수정 응답 { id, username, email }이 조회 응답과 모양이 같아서 그대로 넣는다
      // 무효화해서 다시 받는 것보다 요청이 하나 준다
      queryClient.setQueryData(["user"], res.data.body);
      navigate("/");
    },
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateUser.mutate();
  }

  return (
    <FormCard title="내 정보" onSubmit={handleSubmit}>
      <Input value={form.username} readOnly />
      <Input
        name="email"
        placeholder="이메일"
        value={form.email}
        onChange={handleChange}
      />
      <Input
        name="password"
        type="password"
        placeholder="새 비밀번호"
        value={form.password}
        onChange={handleChange}
      />
      <button className="btn">수정하기</button>
    </FormCard>
  );
}
