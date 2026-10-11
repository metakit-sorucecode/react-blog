import { Link } from "react-router-dom";

export default function BoardItem({ id, title }) {
  return (
    <div className="card bg-base-100 shadow mb-3">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <div className="card-actions justify-end">
          <Link to={`/board/${id}`} className="btn btn-primary btn-sm">상세보기</Link>
        </div>
      </div>
    </div>
  );
}
