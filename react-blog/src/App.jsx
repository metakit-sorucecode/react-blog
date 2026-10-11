import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import SaveForm from "./pages/SaveForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "board/:id", element: <Detail /> },
      { path: "save-form", element: <SaveForm /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
