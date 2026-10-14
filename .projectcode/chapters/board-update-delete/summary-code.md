# board-update-delete 코드 요약

## 테스트 작성
커밋: b82f57d
- 학생 코드 변경 없음

## T1 내 글에만 수정과 삭제 버튼 보이기
커밋: df737ff

| 파일 | 변경 |
|---|---|
| src/pages/Detail.jsx | 고침 |

```diff
// src/pages/Detail.jsx
@@ -9,6 +9,7 @@ export default function Detail() {
     title: "",
     content: "",
     username: "",
+    owner: false,
     replies: [],
   });
 
@@ -25,12 +26,14 @@ export default function Detail() {
       <h1 className="text-2xl font-bold">{board.title}</h1>
       <p>작성자 {board.username}</p>
       <p className="my-8">{board.content}</p>
-      <div className="flex gap-2">
-        <Link to={`/update-form/${id}`} className="btn">
-          수정
-        </Link>
-        <button className="btn">삭제</button>
-      </div>
+      {board.owner && (
+        <div className="flex gap-2">
+          <Link to={`/update-form/${id}`} className="btn">
+            수정
+          </Link>
+          <button className="btn">삭제</button>
+        </div>
+      )}
 
       <hr className="my-8" />
 
```

## T2 수정 입력값을 객체로 기억하기
커밋: 33b4768

| 파일 | 변경 |
|---|---|
| src/pages/UpdateForm.jsx | 고침 |

```diff
// src/pages/UpdateForm.jsx
@@ -1,11 +1,29 @@
+import { useState } from "react";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
 
 export default function UpdateForm() {
+  const [form, setForm] = useState({ title: "", content: "" });
+
+  function handleChange(e) {
+    setForm({ ...form, [e.target.name]: e.target.value });
+  }
+
   return (
     <FormCard title="글 수정">
-      <Input placeholder="제목" />
-      <textarea className="textarea" placeholder="내용" />
+      <Input
+        name="title"
+        placeholder="제목"
+        value={form.title}
+        onChange={handleChange}
+      />
+      <textarea
+        className="textarea"
+        name="content"
+        placeholder="내용"
+        value={form.content}
+        onChange={handleChange}
+      />
       <button className="btn">수정하기</button>
     </FormCard>
   );
```

## T3 수정 화면에 기존 제목과 내용 채우기
커밋: ee0cbcd

| 파일 | 변경 |
|---|---|
| src/pages/UpdateForm.jsx | 고침 |

```diff
// src/pages/UpdateForm.jsx
@@ -1,10 +1,21 @@
-import { useState } from "react";
+import { useEffect, useState } from "react";
+import { useParams } from "react-router-dom";
+import http from "../api/http";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
 
 export default function UpdateForm() {
+  const { id } = useParams();
   const [form, setForm] = useState({ title: "", content: "" });
 
+  useEffect(() => {
+    async function loadBoard() {
+      const res = await http.get(`/api/boards/${id}`);
+      setForm({ title: res.data.body.title, content: res.data.body.content });
+    }
+    loadBoard();
+  }, [id]);
+
   function handleChange(e) {
     setForm({ ...form, [e.target.name]: e.target.value });
   }
```

## T4 수정하기를 누르면 서버에 보내고 상세로 가기
커밋: a42610c

| 파일 | 변경 |
|---|---|
| src/pages/UpdateForm.jsx | 고침 |

```diff
// src/pages/UpdateForm.jsx
@@ -1,5 +1,5 @@
 import { useEffect, useState } from "react";
-import { useParams } from "react-router-dom";
+import { useNavigate, useParams } from "react-router-dom";
 import http from "../api/http";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
@@ -7,6 +7,7 @@ import Input from "../components/Input";
 export default function UpdateForm() {
   const { id } = useParams();
   const [form, setForm] = useState({ title: "", content: "" });
+  const navigate = useNavigate();
 
   useEffect(() => {
     async function loadBoard() {
@@ -20,8 +21,14 @@ export default function UpdateForm() {
     setForm({ ...form, [e.target.name]: e.target.value });
   }
 
+  async function handleSubmit(e) {
+    e.preventDefault();
+    await http.put(`/api/boards/${id}`, form);
+    navigate(`/board/${id}`);
+  }
+
   return (
-    <FormCard title="글 수정">
+    <FormCard title="글 수정" onSubmit={handleSubmit}>
       <Input
         name="title"
         placeholder="제목"
```

## T5 삭제를 누르면 서버에서 지우고 홈으로 가기
커밋: 0e254d5

| 파일 | 변경 |
|---|---|
| src/pages/Detail.jsx | 고침 |

```diff
// src/pages/Detail.jsx
@@ -1,6 +1,6 @@
 import { useEffect, useState } from "react";
 import http from "../api/http";
-import { Link, useParams } from "react-router-dom";
+import { Link, useNavigate, useParams } from "react-router-dom";
 import ReplyItem from "../components/ReplyItem";
 
 export default function Detail() {
@@ -12,6 +12,7 @@ export default function Detail() {
     owner: false,
     replies: [],
   });
+  const navigate = useNavigate();
 
   useEffect(() => {
     async function loadBoard() {
@@ -21,6 +22,11 @@ export default function Detail() {
     loadBoard();
   }, [id]);
 
+  async function handleDelete() {
+    await http.delete(`/api/boards/${id}`);
+    navigate("/");
+  }
+
   return (
     <div>
       <h1 className="text-2xl font-bold">{board.title}</h1>
@@ -31,7 +37,9 @@ export default function Detail() {
           <Link to={`/update-form/${id}`} className="btn">
             수정
           </Link>
-          <button className="btn">삭제</button>
+          <button className="btn" onClick={handleDelete}>
+            삭제
+          </button>
         </div>
       )}
 
```

## 수렴 점검 반영
커밋: 3c58c10
- 학생 코드 변경 없음
