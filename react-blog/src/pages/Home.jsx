import { useQuery } from "@tanstack/react-query";
import http from "../api/http";
import BoardCard from "../components/BoardCard";

export default function Home() {
  // 목록을 캐시에서 꺼내 그린다
  // 캐시에 없거나 stale이면 queryFn으로 서버에서 받아 캐시에 넣는다
  // stale은 다시 받을 때가 된 데이터다. 기본값은 받자마자 stale이다
  // 받기 전에는 data가 undefined라서 빈 배열을 기본값으로 준다
  const { data: boards = [] } = useQuery({
    // 캐시 칸의 이름이다
    // ["boards"] 아래에 두면 글에 관한 키를 한 묶음으로 고를 수 있다
    queryKey: ["boards", "list"],
    // 캐시에 넣을 데이터를 서버에서 받아 돌려준다
    queryFn: async () => {
      const res = await http.get("/?page=0");
      return res.data.body.boards;
    },
  });

  return (
    <div className="grid grid-cols-3 gap-8">
      {boards.map((board) => (
        <BoardCard key={board.id} id={board.id} title={board.title} />
      ))}
    </div>
  );
}
