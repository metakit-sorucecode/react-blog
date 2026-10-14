import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import SaveForm from "./pages/SaveForm";
import UpdateForm from "./pages/UpdateForm";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="board/:id" element={<Detail />} />
          <Route path="save-form" element={<SaveForm />} />
          <Route path="update-form/:id" element={<UpdateForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
