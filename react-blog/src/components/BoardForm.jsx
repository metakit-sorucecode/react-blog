import FormCard from "./FormCard";
import Input from "./Input";

export default function BoardForm({
  title,
  buttonText,
  form = {},
  onChange,
  onSubmit,
}) {
  return (
    <FormCard title={title} onSubmit={onSubmit}>
      <Input
        name="title"
        placeholder="제목"
        value={form.title}
        onChange={onChange}
      />
      <textarea
        className="textarea"
        name="content"
        placeholder="내용"
        value={form.content}
        onChange={onChange}
      />
      <button className="btn">{buttonText}</button>
    </FormCard>
  );
}
