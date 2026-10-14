import FormCard from "../components/FormCard";
import Input from "../components/Input";

export default function UserInfo() {
  return (
    <FormCard title="내 정보">
      <Input value="ssar" readOnly />
      <Input placeholder="이메일" />
      <Input type="password" placeholder="새 비밀번호" />
      <button className="btn">수정하기</button>
    </FormCard>
  );
}
