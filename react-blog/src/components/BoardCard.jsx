import { Link } from "react-router-dom";

export default function BoardCard({ id, title }) {
  return (
    <div className="card border">
      <div className="card-body">
        <Link to={`/board/${id}`}>{title}</Link>
      </div>
    </div>
  );
}
