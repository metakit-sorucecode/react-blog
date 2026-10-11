import FormCard from "../components/FormCard";

export default function UserInfo() {
  return (
    <FormCard title="내 정보">
      <input className="input" value="ssar" readOnly />
      <input className="input" placeholder="이메일" />
      <input className="input" type="password" placeholder="새 비밀번호" />
      <button className="btn">수정하기</button>
    </FormCard>
  );
}
