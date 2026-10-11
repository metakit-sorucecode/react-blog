import FormCard from "./FormCard";
import Input from "./Input";

export default function BoardForm({ title, buttonText }) {
  return (
    <FormCard title={title}>
      <Input placeholder="제목" />
      <textarea className="textarea" placeholder="내용" />
      <button className="btn">{buttonText}</button>
    </FormCard>
  );
}
