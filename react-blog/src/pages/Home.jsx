import BoardCard from "../components/BoardCard";

export default function Home() {
  const boards = [
    { id: 1, title: "제목1" },
    { id: 2, title: "제목2" },
    { id: 3, title: "제목3" },
  ];

  return (
    <div className="grid grid-cols-3 gap-8">
      {boards.map((board) => (
        <BoardCard key={board.id} id={board.id} title={board.title} />
      ))}
    </div>
  );
}
