# react-query 코드 요약

## 테스트 작성
커밋: 169b2c5
- 학생 코드 변경 없음

## T1 QueryClient로 앱 감싸고 Devtools 띄우기
커밋: 315aab9

| 파일 | 변경 |
|---|---|
| src/main.jsx | 고침 |

```diff
// src/main.jsx
@@ -1,10 +1,17 @@
 import { StrictMode } from "react";
 import { createRoot } from "react-dom/client";
+import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
+import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
 import "./index.css";
 import App from "./App";
 
+const queryClient = new QueryClient();
+
 createRoot(document.getElementById("root")).render(
   <StrictMode>
-    <App />
+    <QueryClientProvider client={queryClient}>
+      <App />
+      <ReactQueryDevtools />
+    </QueryClientProvider>
   </StrictMode>,
 );
```

## T2 글 목록을 useQuery로 받기
커밋: c82eaa4

| 파일 | 변경 |
|---|---|
| src/pages/Home.jsx | 고침 |

```diff
// src/pages/Home.jsx
@@ -1,17 +1,15 @@
-import { useEffect, useState } from "react";
+import { useQuery } from "@tanstack/react-query";
 import http from "../api/http";
 import BoardCard from "../components/BoardCard";
 
 export default function Home() {
-  const [boards, setBoards] = useState([]);
-
-  useEffect(() => {
-    async function loadBoards() {
+  const { data: boards = [] } = useQuery({
+    queryKey: ["boards", "list"],
+    queryFn: async () => {
       const res = await http.get("/?page=0");
-      setBoards(res.data.body.boards);
-    }
-    loadBoards();
-  }, []);
+      return res.data.body.boards;
+    },
+  });
 
   return (
     <div className="grid grid-cols-3 gap-8">
```

## T3 상세를 useQuery로 받고 댓글 뒤 상세 키 무효화
커밋: fb3d259

| 파일 | 변경 |
|---|---|
| src/pages/Detail.jsx | 고침 |

```diff
// src/pages/Detail.jsx
@@ -1,28 +1,22 @@
-import { useEffect, useState } from "react";
+import { useState } from "react";
+import { useQuery, useQueryClient } from "@tanstack/react-query";
 import http from "../api/http";
 import { Link, useNavigate, useParams } from "react-router-dom";
 import ReplyItem from "../components/ReplyItem";
 
 export default function Detail() {
   const { id } = useParams();
-  const [board, setBoard] = useState({
-    title: "",
-    content: "",
-    username: "",
-    owner: false,
-    replies: [],
-  });
   const [comment, setComment] = useState("");
   const navigate = useNavigate();
+  const queryClient = useQueryClient();
 
-  async function loadBoard() {
-    const res = await http.get(`/api/boards/${id}`);
-    setBoard(res.data.body);
-  }
-
-  useEffect(() => {
-    loadBoard();
-  }, [id]);
+  const { data: board } = useQuery({
+    queryKey: ["boards", "detail", id],
+    queryFn: async () => {
+      const res = await http.get(`/api/boards/${id}`);
+      return res.data.body;
+    },
+  });
 
   async function handleDelete() {
     await http.delete(`/api/boards/${id}`);
@@ -33,12 +27,16 @@ export default function Detail() {
     e.preventDefault();
     await http.post("/api/replies", { boardId: id, comment });
     setComment("");
-    loadBoard();
+    queryClient.invalidateQueries({ queryKey: ["boards", "detail", id] });
   }
 
   async function handleReplyDelete(replyId) {
     await http.delete(`/api/replies/${replyId}`);
-    loadBoard();
+    queryClient.invalidateQueries({ queryKey: ["boards", "detail", id] });
+  }
+
+  if (!board) {
+    return null;
   }
 
   return (
```

## T4 글 수정 화면을 상세 키로 채우기
커밋: c5ade8f

| 파일 | 변경 |
|---|---|
| src/pages/UpdateForm.jsx | 고침 |

```diff
// src/pages/UpdateForm.jsx
@@ -1,5 +1,6 @@
 import { useEffect, useState } from "react";
 import { useNavigate, useParams } from "react-router-dom";
+import { useQuery } from "@tanstack/react-query";
 import http from "../api/http";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
@@ -9,13 +10,19 @@ export default function UpdateForm() {
   const [form, setForm] = useState({ title: "", content: "" });
   const navigate = useNavigate();
 
-  useEffect(() => {
-    async function loadBoard() {
+  const { data: board } = useQuery({
+    queryKey: ["boards", "detail", id],
+    queryFn: async () => {
       const res = await http.get(`/api/boards/${id}`);
-      setForm({ title: res.data.body.title, content: res.data.body.content });
+      return res.data.body;
+    },
+  });
+
+  useEffect(() => {
+    if (board) {
+      setForm({ title: board.title, content: board.content });
     }
-    loadBoard();
-  }, [id]);
+  }, [board]);
 
   function handleChange(e) {
     setForm({ ...form, [e.target.name]: e.target.value });
```

## T5 내 정보를 useQuery로 받기
커밋: dd139e3

| 파일 | 변경 |
|---|---|
| src/pages/UserInfo.jsx | 고침 |

```diff
// src/pages/UserInfo.jsx
@@ -1,5 +1,6 @@
 import { useEffect, useState } from "react";
 import { useNavigate } from "react-router-dom";
+import { useQuery } from "@tanstack/react-query";
 import http from "../api/http";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
@@ -8,17 +9,19 @@ export default function UserInfo() {
   const [form, setForm] = useState({ username: "", email: "", password: "" });
   const navigate = useNavigate();
 
-  useEffect(() => {
-    async function loadUser() {
+  const { data: user } = useQuery({
+    queryKey: ["user"],
+    queryFn: async () => {
       const res = await http.get("/api/user");
-      setForm({
-        username: res.data.body.username,
-        email: res.data.body.email,
-        password: "",
-      });
+      return res.data.body;
+    },
+  });
+
+  useEffect(() => {
+    if (user) {
+      setForm({ username: user.username, email: user.email, password: "" });
     }
-    loadUser();
-  }, []);
+  }, [user]);
 
   function handleChange(e) {
     setForm({ ...form, [e.target.name]: e.target.value });
```

## 테스트 보강
커밋: d24ee31
- 학생 코드 변경 없음

## T6 글쓰기를 useMutation으로, 목록 즉시 다시 받기
커밋: 33a4743

| 파일 | 변경 |
|---|---|
| src/pages/SaveForm.jsx | 고침 |

```diff
// src/pages/SaveForm.jsx
@@ -1,5 +1,6 @@
 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
+import { useMutation, useQueryClient } from "@tanstack/react-query";
 import http from "../api/http";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
@@ -7,15 +8,26 @@ import Input from "../components/Input";
 export default function SaveForm() {
   const [form, setForm] = useState({ title: "", content: "" });
   const navigate = useNavigate();
+  const queryClient = useQueryClient();
+
+  const saveBoard = useMutation({
+    mutationFn: () => http.post("/api/boards", form),
+    onSuccess: async () => {
+      await queryClient.invalidateQueries({
+        queryKey: ["boards", "list"],
+        refetchType: "all",
+      });
+      navigate("/");
+    },
+  });
 
   function handleChange(e) {
     setForm({ ...form, [e.target.name]: e.target.value });
   }
 
-  async function handleSubmit(e) {
+  function handleSubmit(e) {
     e.preventDefault();
-    await http.post("/api/boards", form);
-    navigate("/");
+    saveBoard.mutate();
   }
 
   return (
```

## T7 글 수정을 useMutation으로, 상세를 받은 뒤 이동
커밋: 23b7212

| 파일 | 변경 |
|---|---|
| src/pages/UpdateForm.jsx | 고침 |

```diff
// src/pages/UpdateForm.jsx
@@ -1,6 +1,6 @@
 import { useEffect, useState } from "react";
 import { useNavigate, useParams } from "react-router-dom";
-import { useQuery } from "@tanstack/react-query";
+import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
 import http from "../api/http";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
@@ -9,6 +9,7 @@ export default function UpdateForm() {
   const { id } = useParams();
   const [form, setForm] = useState({ title: "", content: "" });
   const navigate = useNavigate();
+  const queryClient = useQueryClient();
 
   const { data: board } = useQuery({
     queryKey: ["boards", "detail", id],
@@ -24,14 +25,27 @@ export default function UpdateForm() {
     }
   }, [board]);
 
+  const updateBoard = useMutation({
+    mutationFn: () => http.put(`/api/boards/${id}`, form),
+    onSuccess: async () => {
+      queryClient.invalidateQueries({
+        queryKey: ["boards", "list"],
+        refetchType: "all",
+      });
+      await queryClient.invalidateQueries({
+        queryKey: ["boards", "detail", id],
+      });
+      navigate(`/board/${id}`);
+    },
+  });
+
   function handleChange(e) {
     setForm({ ...form, [e.target.name]: e.target.value });
   }
 
-  async function handleSubmit(e) {
+  function handleSubmit(e) {
     e.preventDefault();
-    await http.put(`/api/boards/${id}`, form);
-    navigate(`/board/${id}`);
+    updateBoard.mutate();
   }
 
   return (
```

## T8 글 삭제를 useMutation으로, replace로 홈 가기
커밋: 14145d2

| 파일 | 변경 |
|---|---|
| src/pages/Detail.jsx | 고침 |

```diff
// src/pages/Detail.jsx
@@ -1,5 +1,5 @@
 import { useState } from "react";
-import { useQuery, useQueryClient } from "@tanstack/react-query";
+import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
 import http from "../api/http";
 import { Link, useNavigate, useParams } from "react-router-dom";
 import ReplyItem from "../components/ReplyItem";
@@ -18,9 +18,19 @@ export default function Detail() {
     },
   });
 
-  async function handleDelete() {
-    await http.delete(`/api/boards/${id}`);
-    navigate("/");
+  const deleteBoard = useMutation({
+    mutationFn: () => http.delete(`/api/boards/${id}`),
+    onSuccess: async () => {
+      await queryClient.invalidateQueries({
+        queryKey: ["boards", "list"],
+        refetchType: "all",
+      });
+      navigate("/", { replace: true });
+    },
+  });
+
+  function handleDelete() {
+    deleteBoard.mutate();
   }
 
   async function handleReplySubmit(e) {
```

## T9 댓글 쓰기와 삭제를 useMutation으로
커밋: 50afe10

| 파일 | 변경 |
|---|---|
| src/pages/Detail.jsx | 고침 |

```diff
// src/pages/Detail.jsx
@@ -29,20 +29,32 @@ export default function Detail() {
     },
   });
 
+  const saveReply = useMutation({
+    mutationFn: () => http.post("/api/replies", { boardId: id, comment }),
+    onSuccess: () => {
+      setComment("");
+      queryClient.invalidateQueries({ queryKey: ["boards", "detail", id] });
+    },
+  });
+
+  const deleteReply = useMutation({
+    mutationFn: (replyId) => http.delete(`/api/replies/${replyId}`),
+    onSuccess: () => {
+      queryClient.invalidateQueries({ queryKey: ["boards", "detail", id] });
+    },
+  });
+
   function handleDelete() {
     deleteBoard.mutate();
   }
 
-  async function handleReplySubmit(e) {
+  function handleReplySubmit(e) {
     e.preventDefault();
-    await http.post("/api/replies", { boardId: id, comment });
-    setComment("");
-    queryClient.invalidateQueries({ queryKey: ["boards", "detail", id] });
+    saveReply.mutate();
   }
 
-  async function handleReplyDelete(replyId) {
-    await http.delete(`/api/replies/${replyId}`);
-    queryClient.invalidateQueries({ queryKey: ["boards", "detail", id] });
+  function handleReplyDelete(replyId) {
+    deleteReply.mutate(replyId);
   }
 
   if (!board) {
```

## T10 내 정보 수정 응답을 setQueryData로 넣기
커밋: dfb6e80

| 파일 | 변경 |
|---|---|
| src/pages/UserInfo.jsx | 고침 |

```diff
// src/pages/UserInfo.jsx
@@ -1,6 +1,6 @@
 import { useEffect, useState } from "react";
 import { useNavigate } from "react-router-dom";
-import { useQuery } from "@tanstack/react-query";
+import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
 import http from "../api/http";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
@@ -8,6 +8,7 @@ import Input from "../components/Input";
 export default function UserInfo() {
   const [form, setForm] = useState({ username: "", email: "", password: "" });
   const navigate = useNavigate();
+  const queryClient = useQueryClient();
 
   const { data: user } = useQuery({
     queryKey: ["user"],
@@ -23,14 +24,22 @@ export default function UserInfo() {
     }
   }, [user]);
 
+  const updateUser = useMutation({
+    mutationFn: () =>
+      http.put("/api/user", { email: form.email, password: form.password }),
+    onSuccess: (res) => {
+      queryClient.setQueryData(["user"], res.data.body);
+      navigate("/");
+    },
+  });
+
   function handleChange(e) {
     setForm({ ...form, [e.target.name]: e.target.value });
   }
 
-  async function handleSubmit(e) {
+  function handleSubmit(e) {
     e.preventDefault();
-    await http.put("/api/user", { email: form.email, password: form.password });
-    navigate("/");
+    updateUser.mutate();
   }
 
   return (
```

## T11 staleTime 1분 두기
커밋: f9fc4ef

| 파일 | 변경 |
|---|---|
| src/main.jsx | 고침 |

```diff
// src/main.jsx
@@ -5,7 +5,14 @@ import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
 import "./index.css";
 import App from "./App";
 
-const queryClient = new QueryClient();
+const queryClient = new QueryClient({
+  defaultOptions: {
+    queries: {
+      staleTime: 60 * 1000, // 받은 데이터를 1분 동안 fresh로 본다
+      // refetchOnWindowFocus는 기본값 true다. 탭이 다시 보이면 지금 화면의 stale 데이터만 다시 받는다
+    },
+  },
+});
 
 createRoot(document.getElementById("root")).render(
   <StrictMode>
```

## T12 로그아웃하면 캐시 비우기
커밋: 61fbca2

| 파일 | 변경 |
|---|---|
| src/components/Header.jsx | 고침 |

```diff
// src/components/Header.jsx
@@ -1,4 +1,5 @@
 import { NavLink, useNavigate } from "react-router-dom";
+import { useQueryClient } from "@tanstack/react-query";
 import { useAuthStore } from "../store/authStore";
 
 export default function Header() {
@@ -6,9 +7,11 @@ export default function Header() {
   const username = useAuthStore((state) => state.username);
   const logout = useAuthStore((state) => state.logout);
   const navigate = useNavigate();
+  const queryClient = useQueryClient();
 
   function handleLogout() {
     logout();
+    queryClient.clear();
     navigate("/");
   }
 
```

## 테스트 보강
커밋: 9202e0d
- 학생 코드 변경 없음

## 수렴 점검
커밋: 0f3fec9
- 학생 코드 변경 없음

## T13 QueryClient와 Devtools에 주석 달기
커밋: afeb53a

| 파일 | 변경 |
|---|---|
| src/main.jsx | 고침 |

```diff
// src/main.jsx
@@ -5,6 +5,8 @@ import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
 import "./index.css";
 import App from "./App";
 
+// 서버에서 받은 데이터를 키별로 담아 두는 캐시 저장소를 만든다
+// 앱 전체에서 하나만 만들고, 아래 Provider로 모든 화면에 나눠 준다
 const queryClient = new QueryClient({
   defaultOptions: {
     queries: {
@@ -16,8 +18,11 @@ const queryClient = new QueryClient({
 
 createRoot(document.getElementById("root")).render(
   <StrictMode>
+    {/* 안쪽 화면들이 useQuery, useMutation, useQueryClient로 이 캐시를 쓰게 한다 */}
     <QueryClientProvider client={queryClient}>
       <App />
+      {/* 오른쪽 아래에 캐시를 들여다보는 버튼을 띄운다. 키마다 stale, inactive 같은 상태가 보인다 */}
+      {/* 개발 모드(npm run dev)에서만 보이고 빌드한 앱에는 나오지 않는다 */}
       <ReactQueryDevtools />
     </QueryClientProvider>
   </StrictMode>,
```

## T14 목록 useQuery에 주석 달기
커밋: b8029ed

| 파일 | 변경 |
|---|---|
| src/pages/Home.jsx | 고침 |

```diff
// src/pages/Home.jsx
@@ -3,8 +3,15 @@ import http from "../api/http";
 import BoardCard from "../components/BoardCard";
 
 export default function Home() {
+  // 목록을 캐시에서 꺼내 그린다
+  // 캐시에 없거나 stale이면 queryFn으로 서버에서 받아 캐시에 넣는다
+  // stale은 다시 받을 때가 된 데이터다. 기본값은 받자마자 stale이다
+  // 받기 전에는 data가 undefined라서 빈 배열을 기본값으로 준다
   const { data: boards = [] } = useQuery({
+    // 캐시 칸의 이름이다
+    // ["boards"] 아래에 두면 글에 관한 키를 한 묶음으로 고를 수 있다
     queryKey: ["boards", "list"],
+    // 캐시에 넣을 데이터를 서버에서 받아 돌려준다
     queryFn: async () => {
       const res = await http.get("/?page=0");
       return res.data.body.boards;
```

## T15 상세 useQuery에 주석 달기
커밋: 0f9b19b

| 파일 | 변경 |
|---|---|
| src/pages/Detail.jsx | 고침 |

```diff
// src/pages/Detail.jsx
@@ -8,8 +8,10 @@ export default function Detail() {
   const { id } = useParams();
   const [comment, setComment] = useState("");
   const navigate = useNavigate();
+  // main.jsx에서 만든 캐시 저장소를 꺼낸다. 쓰기 뒤 캐시를 맞출 때 쓴다
   const queryClient = useQueryClient();
 
+  // 글 상세를 캐시에서 꺼내 그린다
   const { data: board } = useQuery({
     queryKey: ["boards", "detail", id],
     queryFn: async () => {
@@ -33,6 +35,10 @@ export default function Detail() {
     mutationFn: () => http.post("/api/replies", { boardId: id, comment }),
     onSuccess: () => {
       setComment("");
+      // 상세 키를 무효화한다 (invalidateQueries)
+      // 무효화하면 그 키는 stale이 되어 다시 받을 대상이 된다
+      // 이 화면이 위 useQuery로 상세 키를 쓰고 있어서 지금 바로 다시 받는다
+      // 목록에는 댓글이 없어서 목록 키는 건드리지 않는다
       queryClient.invalidateQueries({ queryKey: ["boards", "detail", id] });
     },
   });
@@ -40,6 +46,7 @@ export default function Detail() {
   const deleteReply = useMutation({
     mutationFn: (replyId) => http.delete(`/api/replies/${replyId}`),
     onSuccess: () => {
+      // 댓글 쓰기와 같다. 상세만 지금 바로 다시 받는다
       queryClient.invalidateQueries({ queryKey: ["boards", "detail", id] });
     },
   });
@@ -57,6 +64,7 @@ export default function Detail() {
     deleteReply.mutate(replyId);
   }
 
+  // 받기 전에는 board가 undefined라서 아무것도 그리지 않는다
   if (!board) {
     return null;
   }
```

## T16 수정 화면 조회에 주석 달기
커밋: 1637c73

| 파일 | 변경 |
|---|---|
| src/pages/UpdateForm.jsx | 고침 |

```diff
// src/pages/UpdateForm.jsx
@@ -11,6 +11,9 @@ export default function UpdateForm() {
   const navigate = useNavigate();
   const queryClient = useQueryClient();
 
+  // 상세 화면과 같은 키로 글을 꺼낸다
+  // 상세에서 수정을 눌러 들어오면 상세가 받아 둔 캐시로 바로 채운다
+  // 같은 키에는 같은 모양이 들어가야 하니 상세처럼 res.data.body 전체를 돌려준다
   const { data: board } = useQuery({
     queryKey: ["boards", "detail", id],
     queryFn: async () => {
@@ -19,6 +22,7 @@ export default function UpdateForm() {
     },
   });
 
+  // board가 캐시에서 오면 그 값으로 폼을 채운다
   useEffect(() => {
     if (board) {
       setForm({ title: board.title, content: board.content });
```

## T17 내 정보 조회에 주석 달기
커밋: f08cc05

| 파일 | 변경 |
|---|---|
| src/pages/UserInfo.jsx | 고침 |

```diff
// src/pages/UserInfo.jsx
@@ -10,6 +10,8 @@ export default function UserInfo() {
   const navigate = useNavigate();
   const queryClient = useQueryClient();
 
+  // 내 정보를 ["user"] 키로 캐시에서 꺼낸다
+  // 캐시에 없거나 stale이면 서버에서 받는다
   const { data: user } = useQuery({
     queryKey: ["user"],
     queryFn: async () => {
@@ -18,6 +20,7 @@ export default function UserInfo() {
     },
   });
 
+  // user가 캐시에서 오면 폼을 채운다. 새 비밀번호 칸은 비워 둔다
   useEffect(() => {
     if (user) {
       setForm({ username: user.username, email: user.email, password: "" });
```

## T18 글쓰기 무효화에 주석 달기
커밋: 27b70ae

| 파일 | 변경 |
|---|---|
| src/pages/SaveForm.jsx | 고침 |

```diff
// src/pages/SaveForm.jsx
@@ -10,9 +10,15 @@ export default function SaveForm() {
   const navigate = useNavigate();
   const queryClient = useQueryClient();
 
+  // 서버 데이터를 바꾸는 요청(쓰기)을 맡긴다
+  // mutate()를 부르면 mutationFn을 실행하고, 성공하면 onSuccess를 실행한다
   const saveBoard = useMutation({
     mutationFn: () => http.post("/api/boards", form),
     onSuccess: async () => {
+      // 목록 키를 무효화한다
+      // 목록을 쓰는 화면이 지금 없어서 이 키는 inactive다. 화면에 떠 있는 useQuery가 쓰는 키가 active다
+      // 다시 받을 범위(refetchType)의 기본값 "active"는 active인 키만 받는다. "all"을 줘서 안 보이는 목록도 지금 받게 한다
+      // 다 받은 뒤 이동한다. 그래야 홈에 새 글이 빠진 옛 목록이 잠깐도 보이지 않는다
       await queryClient.invalidateQueries({
         queryKey: ["boards", "list"],
         refetchType: "all",
```

## T19 글 수정 무효화에 주석 달기
커밋: bb72f5f

| 파일 | 변경 |
|---|---|
| src/pages/UpdateForm.jsx | 고침 |

```diff
// src/pages/UpdateForm.jsx
@@ -32,10 +32,17 @@ export default function UpdateForm() {
   const updateBoard = useMutation({
     mutationFn: () => http.put(`/api/boards/${id}`, form),
     onSuccess: async () => {
+      // 목록 키를 무효화한다
+      // 목록을 쓰는 화면이 없어 inactive라 "all"로 지금 받게 한다
+      // 기다리지 않는다. 지금 갈 곳은 상세이고, 목록은 그사이 뒤에서 받아 둔다
       queryClient.invalidateQueries({
         queryKey: ["boards", "list"],
         refetchType: "all",
       });
+      // 상세 키를 무효화한다
+      // 이 수정 화면도 위 useQuery에서 같은 상세 키를 쓰고 있다
+      // 화면에 떠 있는 useQuery가 쓰는 키는 active라서, 기본값만으로 지금 바로 다시 받는다
+      // 다 받은 뒤 이동한다. 그래야 상세 화면에 옛 제목이 잠깐도 보이지 않는다
       await queryClient.invalidateQueries({
         queryKey: ["boards", "detail", id],
       });
```

## T20 글 삭제에 주석 달기
커밋: dfe1a73

| 파일 | 변경 |
|---|---|
| src/pages/Detail.jsx | 고침 |

```diff
// src/pages/Detail.jsx
@@ -23,10 +23,17 @@ export default function Detail() {
   const deleteBoard = useMutation({
     mutationFn: () => http.delete(`/api/boards/${id}`),
     onSuccess: async () => {
+      // 목록 키를 무효화한다
+      // 목록을 쓰는 화면이 없어 inactive라 "all"로 지금 받게 한다
+      // 다 받은 뒤 이동한다. 그래야 홈에 지운 글이 잠깐도 보이지 않는다
       await queryClient.invalidateQueries({
         queryKey: ["boards", "list"],
         refetchType: "all",
       });
+      // 방문 기록의 지운 글 주소를 홈으로 바꾼다 (replace)
+      // 그래서 뒤로 가기를 눌러도 지운 글로 돌아가지 않는다
+      // 지운 글의 상세 캐시는 볼 화면이 없어서 gcTime(기본 5분)이 지나면 저절로 사라진다
+      // removeQueries로 바로 빼지 않는다. 삭제 요청이 성공 상태로 바뀌며 이 화면이 이동 전에 한 번 더 그려지고, 그때 빈 키를 보고 상세를 다시 요청한다
       navigate("/", { replace: true });
     },
   });
```

## T21 댓글 무효화에 주석 달기
커밋: b7b63a1

| 파일 | 변경 |
|---|---|
| src/pages/Detail.jsx | 고침 |

```diff
// src/pages/Detail.jsx
@@ -38,6 +38,7 @@ export default function Detail() {
     },
   });
 
+  // 댓글 쓰기와 삭제도 useMutation에 맡긴다. 성공 뒤 할 일을 onSuccess 한 곳에 모은다
   const saveReply = useMutation({
     mutationFn: () => http.post("/api/replies", { boardId: id, comment }),
     onSuccess: () => {
```

## T22 setQueryData에 주석 달기
커밋: 6700ac0

| 파일 | 변경 |
|---|---|
| src/pages/UserInfo.jsx | 고침 |

```diff
// src/pages/UserInfo.jsx
@@ -30,7 +30,11 @@ export default function UserInfo() {
   const updateUser = useMutation({
     mutationFn: () =>
       http.put("/api/user", { email: form.email, password: form.password }),
+    // res는 mutationFn이 돌려준 수정 응답이다
     onSuccess: (res) => {
+      // 서버에 다시 묻지 않고 ["user"] 캐시를 이 값으로 바꾼다 (setQueryData)
+      // 수정 응답 { id, username, email }이 조회 응답과 모양이 같아서 그대로 넣는다
+      // 무효화해서 다시 받는 것보다 요청이 하나 준다
       queryClient.setQueryData(["user"], res.data.body);
       navigate("/");
     },
```

## T23 staleTime에 주석 달기
커밋: eb453f2

| 파일 | 변경 |
|---|---|
| src/main.jsx | 고침 |

```diff
// src/main.jsx
@@ -10,8 +10,13 @@ import App from "./App";
 const queryClient = new QueryClient({
   defaultOptions: {
     queries: {
-      staleTime: 60 * 1000, // 받은 데이터를 1분 동안 fresh로 본다
-      // refetchOnWindowFocus는 기본값 true다. 탭이 다시 보이면 지금 화면의 stale 데이터만 다시 받는다
+      // 받은 데이터를 1분 동안 fresh로 본다 (staleTime)
+      // 기본값 0이면 받자마자 stale이라 화면에 들어올 때마다 다시 받는다
+      // 1분으로 두면 화면을 오갈 때 방금 받은 데이터를 요청 없이 캐시로 바로 그린다
+      staleTime: 60 * 1000,
+      // 탭이 다시 보일 때 다시 받는 옵션(refetchOnWindowFocus)은 기본값 true를 그대로 쓴다
+      // 지금 화면에 떠 있는 useQuery의 키 중 stale인 것만 다시 받는다
+      // staleTime이 1분이라 받은 지 1분 안에는 탭을 오가도 요청이 가지 않는다
     },
   },
 });
```

## T24 로그아웃 clear에 주석 달기
커밋: 8a5c8c8

| 파일 | 변경 |
|---|---|
| src/components/Header.jsx | 고침 |

```diff
// src/components/Header.jsx
@@ -11,6 +11,8 @@ export default function Header() {
 
   function handleLogout() {
     logout();
+    // 캐시를 모두 비운다 (clear)
+    // 남겨 두면 다음에 로그인한 사람이 앞 사람의 내 정보와 글 owner를 캐시로 먼저 본다
     queryClient.clear();
     navigate("/");
   }
```
