# board-save 코드 요약

## 테스트 작성
커밋: 51cbfba
- 학생 코드 변경 없음

## 앞 장 테스트를 새 글에 맞추기
커밋: 26f3907
- 학생 코드 변경 없음

## T1 글쓰기 입력값을 객체로 기억하기
커밋: 5926288

| 파일 | 변경 |
|---|---|
| src/components/BoardForm.jsx | 고침 |
| src/pages/SaveForm.jsx | 고침 |

```diff
// src/components/BoardForm.jsx
@@ -1,11 +1,22 @@
 import FormCard from "./FormCard";
 import Input from "./Input";
 
-export default function BoardForm({ title, buttonText }) {
+export default function BoardForm({ title, buttonText, form = {}, onChange }) {
   return (
     <FormCard title={title}>
-      <Input placeholder="제목" />
-      <textarea className="textarea" placeholder="내용" />
+      <Input
+        name="title"
+        placeholder="제목"
+        value={form.title}
+        onChange={onChange}
+      />
+      <textarea
+        className="textarea"
+        name="content"
+        placeholder="내용"
+        value={form.content}
+        onChange={onChange}
+      />
       <button className="btn">{buttonText}</button>
     </FormCard>
   );
```

```diff
// src/pages/SaveForm.jsx
@@ -1,5 +1,19 @@
+import { useState } from "react";
 import BoardForm from "../components/BoardForm";
 
 export default function SaveForm() {
-  return <BoardForm title="글쓰기" buttonText="글쓰기" />;
+  const [form, setForm] = useState({ title: "", content: "" });
+
+  function handleChange(e) {
+    setForm({ ...form, [e.target.name]: e.target.value });
+  }
+
+  return (
+    <BoardForm
+      title="글쓰기"
+      buttonText="글쓰기"
+      form={form}
+      onChange={handleChange}
+    />
+  );
 }
```

## T2 axios 인스턴스 http 만들고 앞 요청 바꾸기
커밋: 9c3aa14

| 파일 | 변경 |
|---|---|
| src/api/http.jsx | 새로 |
| src/pages/Detail.jsx | 고침 |
| src/pages/Home.jsx | 고침 |
| src/pages/JoinForm.jsx | 고침 |
| src/pages/LoginForm.jsx | 고침 |

```jsx
// src/api/http.jsx
import axios from "axios";

const http = axios.create({ baseURL: "http://localhost:8080" });

export default http;
```

```diff
// src/pages/Detail.jsx
@@ -1,5 +1,5 @@
 import { useEffect, useState } from "react";
-import axios from "axios";
+import http from "../api/http";
 import { Link, useParams } from "react-router-dom";
 import ReplyItem from "../components/ReplyItem";
 
@@ -14,7 +14,7 @@ export default function Detail() {
 
   useEffect(() => {
     async function loadBoard() {
-      const res = await axios.get(`http://localhost:8080/api/boards/${id}`);
+      const res = await http.get(`/api/boards/${id}`);
       setBoard(res.data.body);
     }
     loadBoard();
```

```diff
// src/pages/Home.jsx
@@ -1,5 +1,5 @@
 import { useEffect, useState } from "react";
-import axios from "axios";
+import http from "../api/http";
 import BoardCard from "../components/BoardCard";
 
 export default function Home() {
@@ -7,7 +7,7 @@ export default function Home() {
 
   useEffect(() => {
     async function loadBoards() {
-      const res = await axios.get("http://localhost:8080/?page=0");
+      const res = await http.get("/?page=0");
       setBoards(res.data.body.boards);
     }
     loadBoards();
```

```diff
// src/pages/JoinForm.jsx
@@ -1,5 +1,5 @@
 import { useState } from "react";
-import axios from "axios";
+import http from "../api/http";
 import { useNavigate } from "react-router-dom";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
@@ -14,7 +14,7 @@ export default function JoinForm() {
 
   async function handleSubmit(e) {
     e.preventDefault();
-    await axios.post("http://localhost:8080/join", form);
+    await http.post("/join", form);
     alert("회원가입 완료");
     navigate("/login-form");
   }
```

```diff
// src/pages/LoginForm.jsx
@@ -1,5 +1,5 @@
 import { useState } from "react";
-import axios from "axios";
+import http from "../api/http";
 import { useNavigate } from "react-router-dom";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
@@ -16,7 +16,7 @@ export default function LoginForm() {
 
   async function handleSubmit(e) {
     e.preventDefault();
-    const res = await axios.post("http://localhost:8080/login", form);
+    const res = await http.post("/login", form);
     const jwt = res.headers.authorization;
     login(jwt, form.username);
     navigate("/");
```

## T3 요청마다 토큰 붙이기
커밋: 6d5e15c

| 파일 | 변경 |
|---|---|
| src/api/http.jsx | 고침 |

```diff
// src/api/http.jsx
@@ -2,4 +2,12 @@ import axios from "axios";
 
 const http = axios.create({ baseURL: "http://localhost:8080" });
 
+http.interceptors.request.use((config) => {
+  const jwt = localStorage.getItem("jwt");
+  if (jwt) {
+    config.headers.Authorization = jwt;
+  }
+  return config;
+});
+
 export default http;
```

## T4 글쓰기를 누르면 서버에 보내고 홈으로 가기
커밋: 4c63fd9

| 파일 | 변경 |
|---|---|
| src/components/BoardForm.jsx | 고침 |
| src/pages/SaveForm.jsx | 고침 |

```diff
// src/components/BoardForm.jsx
@@ -1,9 +1,15 @@
 import FormCard from "./FormCard";
 import Input from "./Input";
 
-export default function BoardForm({ title, buttonText, form = {}, onChange }) {
+export default function BoardForm({
+  title,
+  buttonText,
+  form = {},
+  onChange,
+  onSubmit,
+}) {
   return (
-    <FormCard title={title}>
+    <FormCard title={title} onSubmit={onSubmit}>
       <Input
         name="title"
         placeholder="제목"
```

```diff
// src/pages/SaveForm.jsx
@@ -1,19 +1,29 @@
 import { useState } from "react";
+import { useNavigate } from "react-router-dom";
+import http from "../api/http";
 import BoardForm from "../components/BoardForm";
 
 export default function SaveForm() {
   const [form, setForm] = useState({ title: "", content: "" });
+  const navigate = useNavigate();
 
   function handleChange(e) {
     setForm({ ...form, [e.target.name]: e.target.value });
   }
 
+  async function handleSubmit(e) {
+    e.preventDefault();
+    await http.post("/api/boards", form);
+    navigate("/");
+  }
+
   return (
     <BoardForm
       title="글쓰기"
       buttonText="글쓰기"
       form={form}
       onChange={handleChange}
+      onSubmit={handleSubmit}
     />
   );
 }
```
