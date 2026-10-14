export default function JoinForm() {
  return (
    <form className="card border max-w-sm mx-auto p-8 gap-4">
      <h1 className="text-2xl font-bold">회원가입</h1>
      <input className="input" placeholder="아이디" />
      <input className="input" type="password" placeholder="비밀번호" />
      <input className="input" placeholder="이메일" />
      <button className="btn">가입하기</button>
    </form>
  );
}
