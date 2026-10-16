import { Link } from "react-router-dom";

export default function Notice({ text, to, label }) {
  return (
    <div className="card border max-w-sm mx-auto p-8 text-center">
      <p>{text}</p>
      <Link to={to} className="btn mt-4">
        {label}
      </Link>
    </div>
  );
}
