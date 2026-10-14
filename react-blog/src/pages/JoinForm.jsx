import FormCard from "../components/FormCard";

export default function JoinForm() {
  return (
    <FormCard title="회원가입">
      <input className="input" placeholder="아이디" />
      <input className="input" type="password" placeholder="비밀번호" />
      <input className="input" placeholder="이메일" />
      <button className="btn">가입하기</button>
    </FormCard>
  );
}
