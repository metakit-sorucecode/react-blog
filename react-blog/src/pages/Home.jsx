import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import http from "../api/http";
import BoardCard from "../components/BoardCard";
import Loading from "../components/Loading";

export default function Home() {
  // 지금 보는 페이지 번호다. 서버는 0부터 센다
  const [page, setPage] = useState(0);
  // 검색창에 친 글자다. 제목에 이 글자가 든 글만 받는다
  const [keyword, setKeyword] = useState("");

  // 목록을 캐시에서 꺼내 그린다
  // 캐시에 없거나 stale이면 queryFn으로 서버에서 받아 캐시에 넣는다
  // stale은 다시 받을 때가 된 데이터다. 기본값은 받자마자 stale이다
  // isPending은 아직 받은 데이터가 없을 때 true다
  const { data, isPending, isError } = useQuery({
    // 캐시 칸의 이름이다
    // ["boards"] 아래에 두면 글에 관한 키를 한 묶음으로 고를 수 있다
    // 페이지와 검색어마다 받는 글이 달라서 키에 page와 keyword를 넣는다. 둘마다 캐시 칸이 따로 생긴다
    // 쓰기 뒤 ["boards", "list"]를 무효화하면 앞부분이 같은 모든 페이지와 검색 키에 걸린다
    queryKey: ["boards", "list", { page, keyword }],
    // 캐시에 넣을 데이터를 서버에서 받아 돌려준다
    // params는 주소 뒤에 ?page=0&keyword=처럼 붙는다
    // 글 목록과 함께 isFirst, isLast, totalPage, number를 쓰려고 body 전체를 돌려준다
    queryFn: async () => {
      const res = await http.get("/", { params: { page, keyword } });
      return res.data.body;
    },
  });

  if (isPending) {
    return <Loading />;
  }

  // 받기에 실패하면 data가 없다. 연결 실패는 토스트가 알렸으니 화면을 비워 둔다
  if (isError) {
    return null;
  }

  return (
    <div>
      <input
        className="input w-full mb-8"
        placeholder="제목 검색"
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          // 검색어가 바뀌면 결과의 첫 페이지부터 본다
          setPage(0);
        }}
      />
      <div className="grid grid-cols-3 gap-8">
        {data.boards.map((board) => (
          <BoardCard key={board.id} id={board.id} title={board.title} />
        ))}
      </div>
      {/* number는 서버가 돌려준 지금 페이지 번호다. 화면에는 1부터 보인다 */}
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
