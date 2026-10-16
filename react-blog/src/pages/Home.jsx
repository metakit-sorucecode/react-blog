import { useQuery } from "@tanstack/react-query";
import http from "../api/http";
import BoardCard from "../components/BoardCard";
import Loading from "../components/Loading";

export default function Home() {
  const { data: boards = [], isPending } = useQuery({
    queryKey: ["boards", "list"],
    queryFn: async () => {
      const res = await http.get("/?page=0");
      return res.data.body.boards;
    },
  });

  if (isPending) {
    return <Loading />;
  }

  return (
    <div className="grid grid-cols-3 gap-8">
      {boards.map((board) => (
        <BoardCard key={board.id} id={board.id} title={board.title} />
      ))}
    </div>
  );
}
