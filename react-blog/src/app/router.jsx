import { createBrowserRouter } from "react-router-dom";
import Layout from "../shared/components/Layout";
import ErrorFallback from "../shared/components/ErrorFallback";
import Home from "../features/board/Home";
import Detail from "../features/board/Detail";
import SaveForm from "../features/board/SaveForm";
import UpdateForm from "../features/board/UpdateForm";
import LoginForm from "../features/auth/LoginForm";
import JoinForm from "../features/auth/JoinForm";
import MyInfoForm from "../features/user/MyInfoForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorFallback />,
    children: [
      { index: true, element: <Home /> },
      { path: "board/:id", element: <Detail /> },
      { path: "save-form", element: <SaveForm /> },
      { path: "update-form/:id", element: <UpdateForm /> },
      { path: "login-form", element: <LoginForm /> },
      { path: "join-form", element: <JoinForm /> },
      { path: "user-info", element: <MyInfoForm /> },
    ],
  },
]);
