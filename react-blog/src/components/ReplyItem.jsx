export default function ReplyItem({ username, comment, owner }) {
  return (
    <li className="list-row">
      <span>{username}</span>
      <span>{comment}</span>
      {owner && <button className="btn btn-ghost btn-xs">🗑</button>}
    </li>
  );
}
