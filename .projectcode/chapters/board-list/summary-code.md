# board-list 코드 요약

## 테스트 작성
커밋: b7dc416
- 학생 코드 변경 없음

## T1 글 목록을 state로 바꾸고 빈 목록에서 시작하기
커밋: 31027ab

| 파일 | 변경 |
|---|---|
| src/pages/Home.jsx | 고침 |

```diff
// src/pages/Home.jsx
@@ -1,11 +1,8 @@
+import { useState } from "react";
 import BoardCard from "../components/BoardCard";
 
 export default function Home() {
-  const boards = [
-    { id: 1, title: "제목1" },
-    { id: 2, title: "제목2" },
-    { id: 3, title: "제목3" },
-  ];
+  const [boards, setBoards] = useState([]);
 
   return (
     <div className="grid grid-cols-3 gap-8">
```

## T2 useEffect에서 서버 글 목록 받아 그리기
커밋: b010199

| 파일 | 변경 |
|---|---|
| src/pages/Home.jsx | 고침 |

```diff
// src/pages/Home.jsx
@@ -1,9 +1,18 @@
-import { useState } from "react";
+import { useEffect, useState } from "react";
+import axios from "axios";
 import BoardCard from "../components/BoardCard";
 
 export default function Home() {
   const [boards, setBoards] = useState([]);
 
+  useEffect(() => {
+    async function loadBoards() {
+      const res = await axios.get("http://localhost:8080/?page=0");
+      setBoards(res.data.body.boards);
+    }
+    loadBoards();
+  }, []);
+
   return (
     <div className="grid grid-cols-3 gap-8">
       {boards.map((board) => (
```
