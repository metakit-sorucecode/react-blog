import Notice from "./Notice";
import { useAuthStore } from "../store/authStore";

export default function RequireLogin({ children }) {
  const isLogin = useAuthStore((state) => state.isLogin);

  if (!isLogin) {
    return (
      <Notice text="로그인이 필요합니다" to="/login-form" label="로그인하기" />
    );
  }
  return children;
}
