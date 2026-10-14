import { useRouteError, Link } from "react-router-dom";

export default function ErrorFallback() {
  const error = useRouteError();
  return (
    <div className="text-center mt-20">
      <h2 className="text-2xl font-bold">문제가 발생했습니다 😢</h2>
      <p className="text-gray-500 my-3">{error?.message ?? "알 수 없는 오류"}</p>
      <Link to="/" className="btn btn-primary">홈으로</Link>
    </div>
  );
}
