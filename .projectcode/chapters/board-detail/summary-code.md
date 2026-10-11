# board-detail 코드 요약

## 테스트 작성
커밋: d5028c8
- 학생 코드 변경 없음

## T1 주소에서 글 번호를 꺼내 수정 링크에 쓰기
커밋: 227ebd4

| 파일 | 변경 |
|---|---|
| src/pages/Detail.jsx | 고침 |

```diff
// src/pages/Detail.jsx
@@ -1,7 +1,9 @@
-import { Link } from "react-router-dom";
+import { Link, useParams } from "react-router-dom";
 import ReplyItem from "../components/ReplyItem";
 
 export default function Detail() {
+  const { id } = useParams();
+
   const replies = [
     { id: 1, username: "cos", comment: "댓글1" },
     { id: 2, username: "love", comment: "댓글2" },
@@ -13,7 +15,7 @@ export default function Detail() {
       <p>작성자 ssar</p>
       <p className="my-8">내용1</p>
       <div className="flex gap-2">
-        <Link to="/update-form/1" className="btn">
+        <Link to={`/update-form/${id}`} className="btn">
           수정
         </Link>
         <button className="btn">삭제</button>
```

## T2 글을 state로 바꾸고 빈 상세에서 시작하기
커밋: 1181dab

| 파일 | 변경 |
|---|---|
| src/pages/Detail.jsx | 고침 |

```diff
// src/pages/Detail.jsx
@@ -1,19 +1,21 @@
+import { useState } from "react";
 import { Link, useParams } from "react-router-dom";
 import ReplyItem from "../components/ReplyItem";
 
 export default function Detail() {
   const { id } = useParams();
-
-  const replies = [
-    { id: 1, username: "cos", comment: "댓글1" },
-    { id: 2, username: "love", comment: "댓글2" },
-  ];
+  const [board, setBoard] = useState({
+    title: "",
+    content: "",
+    username: "",
+    replies: [],
+  });
 
   return (
     <div>
-      <h1 className="text-2xl font-bold">제목1</h1>
-      <p>작성자 ssar</p>
-      <p className="my-8">내용1</p>
+      <h1 className="text-2xl font-bold">{board.title}</h1>
+      <p>작성자 {board.username}</p>
+      <p className="my-8">{board.content}</p>
       <div className="flex gap-2">
         <Link to={`/update-form/${id}`} className="btn">
           수정
@@ -25,7 +27,7 @@ export default function Detail() {
 
       <h2 className="font-bold">댓글</h2>
       <ul className="list">
-        {replies.map((reply) => (
+        {board.replies.map((reply) => (
           <ReplyItem
             key={reply.id}
             username={reply.username}
```

## T3 useEffect에서 서버 상세 받아 그리기
커밋: f19df0a

| 파일 | 변경 |
|---|---|
| src/pages/Detail.jsx | 고침 |

```diff
// src/pages/Detail.jsx
@@ -1,4 +1,5 @@
-import { useState } from "react";
+import { useEffect, useState } from "react";
+import axios from "axios";
 import { Link, useParams } from "react-router-dom";
 import ReplyItem from "../components/ReplyItem";
 
@@ -11,6 +12,14 @@ export default function Detail() {
     replies: [],
   });
 
+  useEffect(() => {
+    async function loadBoard() {
+      const res = await axios.get(`http://localhost:8080/api/boards/${id}`);
+      setBoard(res.data.body);
+    }
+    loadBoard();
+  }, [id]);
+
   return (
     <div>
       <h1 className="text-2xl font-bold">{board.title}</h1>
```
