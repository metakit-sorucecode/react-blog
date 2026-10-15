# error-handling 코드 요약

## 테스트 작성
커밋: 8974603
- 학생 코드 변경 없음

## T1 다시 묻기 규칙 정하기
커밋: bf19ff4

| 파일 | 변경 |
|---|---|
| src/main.jsx | 고침 |

```diff
// src/main.jsx
@@ -17,6 +17,19 @@ const queryClient = new QueryClient({
       // 탭이 다시 보일 때 다시 받는 옵션(refetchOnWindowFocus)은 기본값 true를 그대로 쓴다
       // 지금 화면에 떠 있는 useQuery의 키 중 stale인 것만 다시 받는다
       // staleTime이 1분이라 받은 지 1분 안에는 탭을 오가도 요청이 가지 않는다
+
+      // 조회가 실패했을 때 다시 물을지 정한다 (retry)
+      // 기본값은 3번 다시 묻기라서, 없는 글(404)도 몇 초 동안 다시 물은 뒤에야 실패가 된다
+      // failureCount는 이미 다시 물은 횟수다. 첫 실패 때 0이다
+      retry: (failureCount, error) => {
+        // 응답이 400대면 다시 물어도 결과가 같다. 바로 실패로 둔다
+        if (error.response && error.response.status < 500) {
+          return false;
+        }
+        // 500이나 연결 실패는 잠깐 뒤에 될 수도 있다. 한 번만 다시 묻는다
+        return failureCount < 1;
+      },
+      // 쓰기(useMutation)의 retry 기본값은 다시 묻지 않기라서 그대로 둔다
     },
   },
 });
```

## T2 받는 동안 로딩 표시 보이기
커밋: 07d1aee

| 파일 | 변경 |
|---|---|
| src/components/Loading.jsx | 새로 |
| src/pages/Detail.jsx | 고침 |
| src/pages/Home.jsx | 고침 |
| src/pages/UpdateForm.jsx | 고침 |
| src/pages/UserInfo.jsx | 고침 |

```jsx
// src/components/Loading.jsx
export default function Loading() {
  return (
    <div className="text-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}
```

```diff
// src/pages/Detail.jsx
@@ -3,6 +3,7 @@ import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
 import http from "../api/http";
 import { Link, useNavigate, useParams } from "react-router-dom";
 import ReplyItem from "../components/ReplyItem";
+import Loading from "../components/Loading";
 
 export default function Detail() {
   const { id } = useParams();
@@ -12,7 +13,7 @@ export default function Detail() {
   const queryClient = useQueryClient();
 
   // 글 상세를 캐시에서 꺼내 그린다
-  const { data: board } = useQuery({
+  const { data: board, isPending } = useQuery({
     queryKey: ["boards", "detail", id],
     queryFn: async () => {
       const res = await http.get(`/api/boards/${id}`);
@@ -72,7 +73,12 @@ export default function Detail() {
     deleteReply.mutate(replyId);
   }
 
-  // 받기 전에는 board가 undefined라서 아무것도 그리지 않는다
+  // 훅을 모두 부른 뒤에 돌려준다. 훅은 매번 같은 순서로 불려야 한다
+  if (isPending) {
+    return <Loading />;
+  }
+
+  // 실패하면 board가 undefined라서 아무것도 그리지 않는다
   if (!board) {
     return null;
   }
```

```diff
// src/pages/Home.jsx
@@ -1,13 +1,15 @@
 import { useQuery } from "@tanstack/react-query";
 import http from "../api/http";
 import BoardCard from "../components/BoardCard";
+import Loading from "../components/Loading";
 
 export default function Home() {
   // 목록을 캐시에서 꺼내 그린다
   // 캐시에 없거나 stale이면 queryFn으로 서버에서 받아 캐시에 넣는다
   // stale은 다시 받을 때가 된 데이터다. 기본값은 받자마자 stale이다
   // 받기 전에는 data가 undefined라서 빈 배열을 기본값으로 준다
-  const { data: boards = [] } = useQuery({
+  // isPending은 아직 받은 데이터가 없을 때 true다
+  const { data: boards = [], isPending } = useQuery({
     // 캐시 칸의 이름이다
     // ["boards"] 아래에 두면 글에 관한 키를 한 묶음으로 고를 수 있다
     queryKey: ["boards", "list"],
@@ -18,6 +20,10 @@ export default function Home() {
     },
   });
 
+  if (isPending) {
+    return <Loading />;
+  }
+
   return (
     <div className="grid grid-cols-3 gap-8">
       {boards.map((board) => (
```

```diff
// src/pages/UpdateForm.jsx
@@ -4,6 +4,7 @@ import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
 import http from "../api/http";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
+import Loading from "../components/Loading";
 
 export default function UpdateForm() {
   const { id } = useParams();
@@ -14,7 +15,7 @@ export default function UpdateForm() {
   // 상세 화면과 같은 키로 글을 꺼낸다
   // 상세에서 수정을 눌러 들어오면 상세가 받아 둔 캐시로 바로 채운다
   // 같은 키에는 같은 모양이 들어가야 하니 상세처럼 res.data.body 전체를 돌려준다
-  const { data: board } = useQuery({
+  const { data: board, isPending } = useQuery({
     queryKey: ["boards", "detail", id],
     queryFn: async () => {
       const res = await http.get(`/api/boards/${id}`);
@@ -59,6 +60,10 @@ export default function UpdateForm() {
     updateBoard.mutate();
   }
 
+  if (isPending) {
+    return <Loading />;
+  }
+
   return (
     <FormCard title="글 수정" onSubmit={handleSubmit}>
       <Input
```

```diff
// src/pages/UserInfo.jsx
@@ -4,6 +4,7 @@ import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
 import http from "../api/http";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
+import Loading from "../components/Loading";
 
 export default function UserInfo() {
   const [form, setForm] = useState({ username: "", email: "", password: "" });
@@ -12,7 +13,7 @@ export default function UserInfo() {
 
   // 내 정보를 ["user"] 키로 캐시에서 꺼낸다
   // 캐시에 없거나 stale이면 서버에서 받는다
-  const { data: user } = useQuery({
+  const { data: user, isPending } = useQuery({
     queryKey: ["user"],
     queryFn: async () => {
       const res = await http.get("/api/user");
@@ -49,6 +50,10 @@ export default function UserInfo() {
     updateUser.mutate();
   }
 
+  if (isPending) {
+    return <Loading />;
+  }
+
   return (
     <FormCard title="내 정보" onSubmit={handleSubmit}>
       <Input value={form.username} readOnly />
```

## T3 없는 글이면 안내 보이기
커밋: 1f7a8ae

| 파일 | 변경 |
|---|---|
| src/pages/Detail.jsx | 고침 |

```diff
// src/pages/Detail.jsx
@@ -13,7 +13,12 @@ export default function Detail() {
   const queryClient = useQueryClient();
 
   // 글 상세를 캐시에서 꺼내 그린다
-  const { data: board, isPending } = useQuery({
+  const {
+    data: board,
+    isPending,
+    isError,
+    error,
+  } = useQuery({
     queryKey: ["boards", "detail", id],
     queryFn: async () => {
       const res = await http.get(`/api/boards/${id}`);
@@ -78,8 +83,20 @@ export default function Detail() {
     return <Loading />;
   }
 
-  // 실패하면 board가 undefined라서 아무것도 그리지 않는다
-  if (!board) {
+  // isError는 다시 묻기까지 끝내고 실패했을 때 true다
+  if (isError) {
+    // 응답이 왔고 상태가 404면 없는 글이다
+    if (error.response && error.response.status === 404) {
+      return (
+        <div className="text-center">
+          <p>게시글이 없습니다</p>
+          <Link to="/" className="btn mt-4">
+            목록으로
+          </Link>
+        </div>
+      );
+    }
+    // 그 밖의 실패(서버에 닿지 못함)는 화면을 비워 둔다
     return null;
   }
 
```

## T4 없는 주소 안내 보이기
커밋: 457af37

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |
| src/pages/NotFound.jsx | 새로 |

```diff
// src/App.jsx
@@ -7,6 +7,7 @@ import UpdateForm from "./pages/UpdateForm";
 import LoginForm from "./pages/LoginForm";
 import JoinForm from "./pages/JoinForm";
 import UserInfo from "./pages/UserInfo";
+import NotFound from "./pages/NotFound";
 
 export default function App() {
   return (
@@ -20,6 +21,8 @@ export default function App() {
           <Route path="login-form" element={<LoginForm />} />
           <Route path="join-form" element={<JoinForm />} />
           <Route path="user-info" element={<UserInfo />} />
+          {/* 위 주소 어디에도 맞지 않으면 여기로 온다 */}
+          <Route path="*" element={<NotFound />} />
         </Route>
       </Routes>
     </BrowserRouter>
```

```jsx
// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center">
      <p>페이지를 찾을 수 없습니다</p>
      <Link to="/" className="btn mt-4">
        홈으로
      </Link>
    </div>
  );
}
```

## T5 쓰기 실패 이유를 토스트로 보이기
커밋: bc8fc5a

| 파일 | 변경 |
|---|---|
| src/api/http.jsx | 고침 |
| src/main.jsx | 고침 |

```diff
// src/api/http.jsx
@@ -1,4 +1,5 @@
 import axios from "axios";
+import { toast } from "sonner";
 
 const http = axios.create({ baseURL: "http://localhost:8080" });
 
@@ -10,4 +11,19 @@ http.interceptors.request.use((config) => {
   return config;
 });
 
+// 응답을 받은 뒤 화면 코드보다 먼저 거친다
+// 성공은 그대로 돌려주고, 실패만 여기서 알린다
+http.interceptors.response.use(
+  (res) => res,
+  (error) => {
+    // 조회(get)가 아니면 쓰기 실패다. 서버가 보낸 이유(msg)를 토스트로 띄운다
+    // 조회 실패는 화면이 isError로 안내하니 띄우지 않는다
+    if (error.config.method !== "get") {
+      toast(error.response.data.msg);
+    }
+    // 에러를 그대로 넘긴다. 그래야 요청을 부른 쪽도 실패한 줄 안다
+    return Promise.reject(error);
+  },
+);
+
 export default http;
```

```diff
// src/main.jsx
@@ -2,6 +2,7 @@ import { StrictMode } from "react";
 import { createRoot } from "react-dom/client";
 import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
+import { Toaster } from "sonner";
 import "./index.css";
 import App from "./App";
 
@@ -42,6 +43,21 @@ createRoot(document.getElementById("root")).render(
       {/* 오른쪽 아래에 캐시를 들여다보는 버튼을 띄운다. 키마다 stale, inactive 같은 상태가 보인다 */}
       {/* 개발 모드(npm run dev)에서만 보이고 빌드한 앱에는 나오지 않는다 */}
       <ReactQueryDevtools />
+      {/* toast()로 띄운 알림이 나오는 자리다. 오른쪽 아래는 Devtools 버튼 자리라 위 오른쪽에 둔다 */}
+      {/* 검정 바탕, 흰 글자, 테두리 없이 글 길이만큼만 넓게 그린다 */}
+      <Toaster
+        position="top-right"
+        toastOptions={{
+          style: {
+            background: "black",
+            color: "white",
+            border: "none",
+            padding: "8px 16px",
+            width: "fit-content",
+            right: 0,
+          },
+        }}
+      />
     </QueryClientProvider>
   </StrictMode>,
 );
```

## T6 가입과 로그인 실패면 이동 막기
커밋: 0a2d854

| 파일 | 변경 |
|---|---|
| src/pages/JoinForm.jsx | 고침 |
| src/pages/LoginForm.jsx | 고침 |

```diff
// src/pages/JoinForm.jsx
@@ -14,9 +14,14 @@ export default function JoinForm() {
 
   async function handleSubmit(e) {
     e.preventDefault();
-    await http.post("/join", form);
-    alert("회원가입 완료");
-    navigate("/login-form");
+    try {
+      await http.post("/join", form);
+      alert("회원가입 완료");
+      navigate("/login-form");
+    } catch {
+      // 실패 알림은 인터셉터가 토스트로 띄웠다. 여기서는 이동만 막는다
+      // catch가 없으면 받아 줄 곳이 없는 에러가 콘솔에 Uncaught로 남는다
+    }
   }
 
   return (
```

```diff
// src/pages/LoginForm.jsx
@@ -16,10 +16,14 @@ export default function LoginForm() {
 
   async function handleSubmit(e) {
     e.preventDefault();
-    const res = await http.post("/login", form);
-    const jwt = res.headers.authorization;
-    login(jwt, form.username);
-    navigate("/");
+    try {
+      const res = await http.post("/login", form);
+      const jwt = res.headers.authorization;
+      login(jwt, form.username);
+      navigate("/");
+    } catch {
+      // 실패 알림은 인터셉터가 토스트로 띄웠다. 여기서는 이동만 막는다
+    }
   }
 
   return (
```

## T7 서버에 연결할 수 없으면 알리기
커밋: 1bebd8d

| 파일 | 변경 |
|---|---|
| src/api/http.jsx | 고침 |

```diff
// src/api/http.jsx
@@ -16,9 +16,14 @@ http.interceptors.request.use((config) => {
 http.interceptors.response.use(
   (res) => res,
   (error) => {
-    // 조회(get)가 아니면 쓰기 실패다. 서버가 보낸 이유(msg)를 토스트로 띄운다
-    // 조회 실패는 화면이 isError로 안내하니 띄우지 않는다
-    if (error.config.method !== "get") {
+    if (!error.response) {
+      // 응답이 없으면 서버에 닿지 못한 것이다. msg도 없으니 정해 둔 글을 띄운다
+      // 조회는 한 번 더 묻기 때문에 이 줄이 두 번 불린다
+      // 같은 id의 토스트는 새로 쌓이지 않고 그 자리를 바꿔서 하나만 보인다
+      toast("서버에 연결할 수 없습니다", { id: "network" });
+    } else if (error.config.method !== "get") {
+      // 조회(get)가 아니면 쓰기 실패다. 서버가 보낸 이유(msg)를 토스트로 띄운다
+      // 조회 실패는 화면이 isError로 안내하니 띄우지 않는다
       toast(error.response.data.msg);
     }
     // 에러를 그대로 넘긴다. 그래야 요청을 부른 쪽도 실패한 줄 안다
```

## 테스트 보강
커밋: 454150a
- 학생 코드 변경 없음

## T8 안내를 Notice 컴포넌트로 빼기
커밋: 45a85d9

| 파일 | 변경 |
|---|---|
| src/components/Notice.jsx | 새로 |
| src/pages/Detail.jsx | 고침 |
| src/pages/NotFound.jsx | 고침 |

```jsx
// src/components/Notice.jsx
import { Link } from "react-router-dom";

// 안내 글 한 줄과 이동할 링크 버튼을 가운데에 보인다
export default function Notice({ text, to, label }) {
  return (
    <div className="text-center">
      <p>{text}</p>
      <Link to={to} className="btn mt-4">
        {label}
      </Link>
    </div>
  );
}
```

```diff
// src/pages/Detail.jsx
@@ -4,6 +4,7 @@ import http from "../api/http";
 import { Link, useNavigate, useParams } from "react-router-dom";
 import ReplyItem from "../components/ReplyItem";
 import Loading from "../components/Loading";
+import Notice from "../components/Notice";
 
 export default function Detail() {
   const { id } = useParams();
@@ -87,14 +88,7 @@ export default function Detail() {
   if (isError) {
     // 응답이 왔고 상태가 404면 없는 글이다
     if (error.response && error.response.status === 404) {
-      return (
-        <div className="text-center">
-          <p>게시글이 없습니다</p>
-          <Link to="/" className="btn mt-4">
-            목록으로
-          </Link>
-        </div>
-      );
+      return <Notice text="게시글이 없습니다" to="/" label="목록으로" />;
     }
     // 그 밖의 실패(서버에 닿지 못함)는 화면을 비워 둔다
     return null;
```

```diff
// src/pages/NotFound.jsx
@@ -1,12 +1,5 @@
-import { Link } from "react-router-dom";
+import Notice from "../components/Notice";
 
 export default function NotFound() {
-  return (
-    <div className="text-center">
-      <p>페이지를 찾을 수 없습니다</p>
-      <Link to="/" className="btn mt-4">
-        홈으로
-      </Link>
-    </div>
-  );
+  return <Notice text="페이지를 찾을 수 없습니다" to="/" label="홈으로" />;
 }
```
