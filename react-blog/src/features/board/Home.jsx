import { useState } from "react";
import BoardItem from "./BoardItem";
import { useDummy } from "../../shared/dummy/DummyProvider";

export default function Home() {
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const { getBoards } = useDummy();
  const data = getBoards(page, keyword);

  return (
    <div>
      <input
        type="search"
        placeholder="검색"
        className="input input-bordered w-full mb-4"
        value={keyword}
        onChange={(e) => { setKeyword(e.target.value); setPage(0); }}
      />

      {data.boards.length === 0 && <p className="text-center text-gray-500 my-8">게시글이 없습니다.</p>}

      {data.boards.map((board) => (
        <BoardItem key={board.id} id={board.id} title={board.title} />
      ))}

      <div className="flex justify-center gap-2 mt-4">
        <button className="btn btn-sm" disabled={data.isFirst} onClick={() => setPage(page - 1)}>이전</button>
        <button className="btn btn-sm btn-active">{data.number + 1} / {data.totalPage}</button>
        <button className="btn btn-sm" disabled={data.isLast} onClick={() => setPage(page + 1)}>다음</button>
      </div>
    </div>
  );
}
