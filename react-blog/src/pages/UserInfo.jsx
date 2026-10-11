export default function UserInfo() {
  return (
    <form className="card border max-w-sm mx-auto p-8 gap-4">
      <h1 className="text-2xl font-bold">내 정보</h1>
      <input className="input" value="ssar" readOnly />
      <input className="input" placeholder="이메일" />
      <input className="input" type="password" placeholder="새 비밀번호" />
      <button className="btn">수정하기</button>
    </form>
  );
}
