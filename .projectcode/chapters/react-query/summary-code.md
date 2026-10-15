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
