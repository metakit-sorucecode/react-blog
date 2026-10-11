import FormCard from "../components/FormCard";

export default function LoginForm() {
  return (
    <FormCard title="로그인">
      <input className="input" placeholder="아이디" />
      <input className="input" type="password" placeholder="비밀번호" />
      <button className="btn">로그인</button>
    </FormCard>
  );
}
