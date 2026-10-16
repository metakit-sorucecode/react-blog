import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import http from "../api/http";
import BoardCard from "../components/BoardCard";
import Loading from "../components/Loading";
import useDebounce from "../hooks/useDebounce";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const [search, setSearch] = useState({ page: 0, keyword: "" });

  useEffect(() => {
    setSearch({ page: 0, keyword: debouncedKeyword });
  }, [debouncedKeyword]);

  const { data, isPending, isError } = useQuery({
    queryKey: ["boards", "list", search],
    queryFn: async () => {
      const res = await http.get("/", { params: search });
      return res.data.body;
    },
    placeholderData: keepPreviousData,
  });

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return null;
  }

  return (
    <div>
      <input
        className="input w-full mb-8"
        placeholder="제목 검색"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      {keyword !== debouncedKeyword && (
        <p className="text-center mb-8">검색 중...</p>
      )}
      {data.boards.length === 0 ? (
        <p className="text-center">검색 결과가 없습니다</p>
      ) : (
        <div className="grid grid-cols-3 gap-8">
          {data.boards.map((board) => (
            <BoardCard key={board.id} id={board.id} title={board.title} />
          ))}
        </div>
      )}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          className="btn"
          disabled={data.isFirst}
          onClick={() => setSearch({ ...search, page: data.number - 1 })}
        >
          이전
        </button>
        <span>
          {data.number + 1} / {data.totalPage}
        </span>
        <button
          className="btn"
          disabled={data.isLast}
          onClick={() => setSearch({ ...search, page: data.number + 1 })}
        >
          다음
        </button>
      </div>
    </div>
  );
}
