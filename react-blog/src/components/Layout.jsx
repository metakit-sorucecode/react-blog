import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <Header />
      <hr className="mb-8" />
      <Outlet />
    </div>
  );
}
