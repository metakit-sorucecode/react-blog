import { useEffect, useState } from "react";
import axios from "axios";
import BoardCard from "../components/BoardCard";

export default function Home() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    async function loadBoards() {
      const res = await axios.get("http://localhost:8080/?page=0");
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
