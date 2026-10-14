export default function FormCard({ title, children }) {
  return (
    <form className="card border max-w-sm mx-auto p-8 gap-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
    </form>
  );
}
