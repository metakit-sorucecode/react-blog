import FormCard from "../components/FormCard";

export default function SaveForm() {
  return (
    <FormCard title="글쓰기">
      <input className="input" placeholder="제목" />
      <textarea className="textarea" placeholder="내용" />
      <button className="btn">글쓰기</button>
    </FormCard>
  );
}
