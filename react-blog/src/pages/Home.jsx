import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="card border">
        <div className="card-body">
          <Link to="/board/1">제목1</Link>
        </div>
      </div>
      <div className="card border">
        <div className="card-body">
          <Link to="/board/2">제목2</Link>
        </div>
      </div>
      <div className="card border">
        <div className="card-body">
          <Link to="/board/3">제목3</Link>
        </div>
      </div>
    </div>
  );
}
