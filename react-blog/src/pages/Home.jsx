import BoardCard from "../components/BoardCard";

export default function Home() {
  return (
    <div className="grid grid-cols-3 gap-8">
      <BoardCard id={1} title="제목1" />
      <BoardCard id={2} title="제목2" />
      <BoardCard id={3} title="제목3" />
    </div>
  );
}
