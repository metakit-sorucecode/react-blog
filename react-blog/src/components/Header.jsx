import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <ul className="menu menu-horizontal">
      <li>
        <NavLink to="/" end>
          홈
        </NavLink>
      </li>
      <li>
        <NavLink to="/login-form">로그인</NavLink>
      </li>
      <li>
        <NavLink to="/join-form">회원가입</NavLink>
      </li>
      <li>
        <NavLink to="/save-form">글쓰기</NavLink>
      </li>
      <li>
        <NavLink to="/user-info">내 정보</NavLink>
      </li>
    </ul>
  );
}
