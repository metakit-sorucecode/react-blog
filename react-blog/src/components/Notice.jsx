import { Link } from "react-router-dom";

// 안내 글 한 줄과 이동할 링크 버튼을 가운데에 보인다
export default function Notice({ text, to, label }) {
  return (
    <div className="text-center">
      <p>{text}</p>
      <Link to={to} className="btn mt-4">
        {label}
      </Link>
    </div>
  );
}
