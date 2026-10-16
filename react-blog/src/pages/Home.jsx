import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import http from "../api/http";
import BoardCard from "../components/BoardCard";
import Loading from "../components/Loading";

export default function Home() {
  const [page, setPage] = useState(0);

  const { data, isPending, isError } = useQuery({
    queryKey: ["boards", "list", { page }],
    queryFn: async () => {
      const res = await http.get("/", { params: { page } });
      return res.data.body;
    },
  });

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return null;
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-8">
        {data.boards.map((board) => (
          <BoardCard key={board.id} id={board.id} title={board.title} />
        ))}
      </div>
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          className="btn"
          disabled={data.isFirst}
          onClick={() => setPage(data.number - 1)}
        >
          이전
        </button>
        <span>
          {data.number + 1} / {data.totalPage}
        </span>
        <button
          className="btn"
          disabled={data.isLast}
          onClick={() => setPage(data.number + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
}
