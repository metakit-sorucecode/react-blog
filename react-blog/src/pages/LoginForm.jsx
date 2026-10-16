import { useForm } from "react-hook-form";
import http from "../api/http";
import { useNavigate } from "react-router-dom";
import FormCard from "../components/FormCard";
import Input from "../components/Input";
import Notice from "../components/Notice";
import { useAuthStore } from "../store/authStore";

export default function LoginForm() {
  const { register, handleSubmit } = useForm();
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const isLogin = useAuthStore((state) => state.isLogin);

  async function onSubmit(data) {
    try {
      const res = await http.post("/login", data);
      const jwt = res.headers.authorization;
      login(jwt, data.username);
      navigate("/");
    } catch {}
  }

  if (isLogin) {
    return <Notice text="이미 로그인했습니다" to="/" label="홈으로" />;
  }

  return (
    <FormCard title="로그인" onSubmit={handleSubmit(onSubmit)}>
      <Input placeholder="아이디" {...register("username")} />
      <Input type="password" placeholder="비밀번호" {...register("password")} />
      <button className="btn">로그인</button>
    </FormCard>
  );
}
