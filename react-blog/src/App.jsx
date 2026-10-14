import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Detail from "./pages/Detail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="board/:id" element={<Detail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
