export default function ReplyItem({ username, comment }) {
  return (
    <li className="list-row">
      <span>{username}</span>
      <span>{comment}</span>
      <button className="btn btn-ghost btn-xs">🗑</button>
    </li>
  );
}
