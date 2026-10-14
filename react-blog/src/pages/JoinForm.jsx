import FormCard from "../components/FormCard";
import Input from "../components/Input";

export default function JoinForm() {
  return (
    <FormCard title="회원가입">
      <Input placeholder="아이디" />
      <Input type="password" placeholder="비밀번호" />
      <Input placeholder="이메일" />
      <button className="btn">가입하기</button>
    </FormCard>
  );
}
