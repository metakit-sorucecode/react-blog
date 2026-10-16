import { useForm } from "react-hook-form";
import http from "../api/http";
import { useNavigate } from "react-router-dom";
import FormCard from "../components/FormCard";
import Input from "../components/Input";

export default function JoinForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  async function onSubmit(data) {
    try {
      await http.post("/join", data);
      alert("회원가입 완료");
      navigate("/login-form");
    } catch {}
  }

  return (
    <FormCard title="회원가입" onSubmit={handleSubmit(onSubmit)}>
      <Input placeholder="아이디" {...register("username")} />
      <Input
        type="password"
        placeholder="비밀번호"
        {...register("password", {
          minLength: { value: 4, message: "비밀번호는 4자 이상이어야 합니다" },
        })}
      />
      {errors.password && (
        <p className="text-error text-sm">{errors.password.message}</p>
      )}
      <Input placeholder="이메일" {...register("email")} />
      <button className="btn">가입하기</button>
    </FormCard>
  );
}
