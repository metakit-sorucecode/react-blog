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

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await http.get("/api/user");
      return res.data.body;
    },
  });

  useEffect(() => {
    if (user) {
      setForm({ username: user.username, email: user.email, password: "" });
    }
  }, [user]);

  const updateUser = useMutation({
    mutationFn: () =>
      http.put("/api/user", { email: form.email, password: form.password }),
    onSuccess: (res) => {
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
