import FormCard from "../components/FormCard";
import Input from "../components/Input";

export default function SaveForm() {
  return (
    <FormCard title="글쓰기">
      <Input placeholder="제목" />
      <textarea className="textarea" placeholder="내용" />
      <button className="btn">글쓰기</button>
    </FormCard>
  );
}
