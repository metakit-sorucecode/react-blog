import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center">
      <p>페이지를 찾을 수 없습니다</p>
      <Link to="/" className="btn mt-4">
        홈으로
      </Link>
    </div>
  );
}
