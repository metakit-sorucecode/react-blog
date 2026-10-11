import FormCard from "../components/FormCard";
import Input from "../components/Input";

export default function LoginForm() {
  return (
    <FormCard title="로그인">
      <Input placeholder="아이디" />
      <Input type="password" placeholder="비밀번호" />
      <button className="btn">로그인</button>
    </FormCard>
  );
}
