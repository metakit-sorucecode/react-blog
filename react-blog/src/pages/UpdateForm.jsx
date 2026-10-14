import FormCard from "../components/FormCard";
import Input from "../components/Input";

export default function UpdateForm() {
  return (
    <FormCard title="글 수정">
      <Input placeholder="제목" />
      <textarea className="textarea" placeholder="내용" />
      <button className="btn">수정하기</button>
    </FormCard>
  );
}
