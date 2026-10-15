import { useForm } from "react-hook-form";
import http from "../api/http";
import { useNavigate } from "react-router-dom";
import FormCard from "../components/FormCard";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

export default function LoginForm() {
  const { register, handleSubmit } = useForm();
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  // data는 { username, password }다
  async function onSubmit(data) {
    try {
      const res = await http.post("/login", data);
      const jwt = res.headers.authorization;
      login(jwt, data.username);
      navigate("/");
    } catch {
      // 실패 알림은 인터셉터가 토스트로 띄웠다. 여기서는 이동만 막는다
    }
  }

  return (
    <FormCard title="로그인" onSubmit={handleSubmit(onSubmit)}>
      <Input placeholder="아이디" {...register("username")} />
      <Input type="password" placeholder="비밀번호" {...register("password")} />
      <button className="btn">로그인</button>
    </FormCard>
  );
}
