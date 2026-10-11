export default function UpdateForm() {
  return (
    <form className="card border max-w-sm mx-auto p-8 gap-4">
      <h1 className="text-2xl font-bold">글 수정</h1>
      <input className="input" placeholder="제목" />
      <textarea className="textarea" placeholder="내용" />
      <button className="btn">수정하기</button>
    </form>
  );
}
