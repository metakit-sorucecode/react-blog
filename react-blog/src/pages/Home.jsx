import { useQuery } from "@tanstack/react-query";
import http from "../api/http";
import BoardCard from "../components/BoardCard";

export default function Home() {
  const { data: boards = [] } = useQuery({
    queryKey: ["boards", "list"],
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
