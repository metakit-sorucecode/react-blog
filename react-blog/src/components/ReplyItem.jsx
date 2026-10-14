export default function ReplyItem({ username, comment, owner, onDelete }) {
  return (
    <li className="list-row">
      <span>{username}</span>
      <span>{comment}</span>
      {owner && (
        <button className="btn btn-ghost btn-xs" onClick={onDelete}>
          🗑
        </button>
      )}
    </li>
  );
}
