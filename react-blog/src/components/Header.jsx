import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Header() {
  const isLogin = useAuthStore((state) => state.isLogin);
  const username = useAuthStore((state) => state.username);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <ul className="menu menu-horizontal">
      <li>
        <NavLink to="/" end>
          홈
        </NavLink>
      </li>
      {isLogin ? (
        <>
          <li>
            <NavLink to="/save-form">글쓰기</NavLink>
          </li>
          <li>
            <NavLink to="/user-info">내 정보</NavLink>
          </li>
          <li>
            <button onClick={handleLogout}>로그아웃</button>
          </li>
          <li>
            <span>{username}님</span>
          </li>
        </>
      ) : (
        <>
          <li>
            <NavLink to="/login-form">로그인</NavLink>
          </li>
          <li>
            <NavLink to="/join-form">회원가입</NavLink>
          </li>
        </>
      )}
    </ul>
  );
}
