import { useState } from "react";
import BoardCard from "../components/BoardCard";

export default function Home() {
  const [boards, setBoards] = useState([]);

  return (
    <div className="grid grid-cols-3 gap-8">
      {boards.map((board) => (
        <BoardCard key={board.id} id={board.id} title={board.title} />
      ))}
    </div>
  );
}
