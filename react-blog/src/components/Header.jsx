import { NavLink, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";

export default function Header() {
  const isLogin = useAuthStore((state) => state.isLogin);
  const username = useAuthStore((state) => state.username);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function handleLogout() {
    logout();
    // 캐시를 모두 비운다 (clear)
    // 남겨 두면 다음에 로그인한 사람이 앞 사람의 내 정보와 글 owner를 캐시로 먼저 본다
    queryClient.clear();
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
