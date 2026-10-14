import { Trash2 } from "lucide-react";
import { useDummy } from "../../shared/dummy/DummyProvider";

export default function ReplyItem({ reply }) {
  const { deleteReply } = useDummy();
  return (
    <div className="card bg-base-100 shadow mb-3">
      <div className="card-body flex-row justify-between items-start">
        <div>
          <h6 className="font-bold">{reply.username}</h6>
          <p className="mt-1">{reply.comment}</p>
        </div>
        {reply.owner && (
          <button className="btn btn-error btn-sm" onClick={() => deleteReply(reply.id)} aria-label="댓글 삭제">
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
