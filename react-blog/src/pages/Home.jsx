import { useEffect, useState } from "react";
import http from "../api/http";
import BoardCard from "../components/BoardCard";

export default function Home() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    async function loadBoards() {
      const res = await http.get("/?page=0");
      setBoards(res.data.body.boards);
    }
    loadBoards();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-8">
      {boards.map((board) => (
        <BoardCard key={board.id} id={board.id} title={board.title} />
      ))}
    </div>
  );
}
