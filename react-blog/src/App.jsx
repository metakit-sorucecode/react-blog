import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import SaveForm from "./pages/SaveForm";
import UpdateForm from "./pages/UpdateForm";
import LoginForm from "./pages/LoginForm";
import JoinForm from "./pages/JoinForm";
import UserInfo from "./pages/UserInfo";
import NotFound from "./pages/NotFound";
import RequireLogin from "./components/RequireLogin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="board/:id" element={<Detail />} />
          <Route
            path="save-form"
            element={
              <RequireLogin>
                <SaveForm />
              </RequireLogin>
            }
          />
          <Route
            path="update-form/:id"
            element={
              <RequireLogin>
                <UpdateForm />
              </RequireLogin>
            }
          />
          <Route path="login-form" element={<LoginForm />} />
          <Route path="join-form" element={<JoinForm />} />
          <Route
            path="user-info"
            element={
              <RequireLogin>
                <UserInfo />
              </RequireLogin>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
