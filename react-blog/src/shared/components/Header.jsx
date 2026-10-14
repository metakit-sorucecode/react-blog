import { Link, useNavigate } from "react-router-dom";
import { useDummy } from "../dummy/DummyProvider";

export default function Header() {
  const { isLogin, me, logout } = useDummy();
  const navigate = useNavigate();

  function handleLogout() {
    navigate("/");
    logout();
  }

  return (
    <div className="navbar bg-neutral text-neutral-content px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-neutral-content text-xl">
          블로그홈
        </Link>
      </div>
      <div className="flex-none items-center gap-1">
        {isLogin ? (
          <>
            <span className="text-sm opacity-70 mr-2">{me.username}님</span>
            <Link to="/save-form" className="btn btn-ghost text-neutral-content btn-sm">글쓰기</Link>
            <Link to="/user-info" className="btn btn-ghost text-neutral-content btn-sm">내정보</Link>
            <button onClick={handleLogout} className="btn btn-ghost text-neutral-content btn-sm">로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login-form" className="btn btn-ghost text-neutral-content btn-sm">로그인</Link>
            <Link to="/join-form" className="btn btn-ghost text-neutral-content btn-sm">회원가입</Link>
          </>
        )}
      </div>
    </div>
  );
}
