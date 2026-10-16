# paging-search 코드 요약

## 테스트 작성
커밋: aa5901f

- 학생 코드 변경 없음

## 테스트 보강
커밋: 2b5370a

- 학생 코드 변경 없음

## T1 페이지 번호를 키에 넣고 이전, 다음으로 넘기기
커밋: 5a37c46

| 파일 | 변경 |
|---|---|
| src/pages/Home.jsx | 고침 |

```diff
// src/pages/Home.jsx
@@ -1,22 +1,29 @@
+import { useState } from "react";
 import { useQuery } from "@tanstack/react-query";
 import http from "../api/http";
 import BoardCard from "../components/BoardCard";
 import Loading from "../components/Loading";
 
 export default function Home() {
+  // 지금 보는 페이지 번호다. 서버는 0부터 센다
+  const [page, setPage] = useState(0);
+
   // 목록을 캐시에서 꺼내 그린다
   // 캐시에 없거나 stale이면 queryFn으로 서버에서 받아 캐시에 넣는다
   // stale은 다시 받을 때가 된 데이터다. 기본값은 받자마자 stale이다
-  // 받기 전에는 data가 undefined라서 빈 배열을 기본값으로 준다
   // isPending은 아직 받은 데이터가 없을 때 true다
-  const { data: boards = [], isPending } = useQuery({
+  const { data, isPending, isError } = useQuery({
     // 캐시 칸의 이름이다
     // ["boards"] 아래에 두면 글에 관한 키를 한 묶음으로 고를 수 있다
-    queryKey: ["boards", "list"],
+    // 페이지마다 받는 글이 달라서 키에 page를 넣는다. 페이지마다 캐시 칸이 따로 생긴다
+    // 쓰기 뒤 ["boards", "list"]를 무효화하면 앞부분이 같은 모든 페이지 키에 걸린다
+    queryKey: ["boards", "list", { page }],
     // 캐시에 넣을 데이터를 서버에서 받아 돌려준다
+    // params는 주소 뒤에 ?page=0처럼 붙는다
+    // 글 목록과 함께 isFirst, isLast, totalPage, number를 쓰려고 body 전체를 돌려준다
     queryFn: async () => {
-      const res = await http.get("/?page=0");
-      return res.data.body.boards;
+      const res = await http.get("/", { params: { page } });
+      return res.data.body;
     },
   });
 
@@ -24,11 +31,38 @@ export default function Home() {
     return <Loading />;
   }
 
+  // 받기에 실패하면 data가 없다. 연결 실패는 토스트가 알렸으니 화면을 비워 둔다
+  if (isError) {
+    return null;
+  }
+
   return (
-    <div className="grid grid-cols-3 gap-8">
-      {boards.map((board) => (
-        <BoardCard key={board.id} id={board.id} title={board.title} />
-      ))}
+    <div>
+      <div className="grid grid-cols-3 gap-8">
+        {data.boards.map((board) => (
+          <BoardCard key={board.id} id={board.id} title={board.title} />
+        ))}
+      </div>
+      {/* number는 서버가 돌려준 지금 페이지 번호다. 화면에는 1부터 보인다 */}
+      <div className="flex justify-center items-center gap-4 mt-8">
+        <button
+          className="btn"
+          disabled={data.isFirst}
+          onClick={() => setPage(data.number - 1)}
+        >
+          이전
+        </button>
+        <span>
+          {data.number + 1} / {data.totalPage}
+        </span>
+        <button
+          className="btn"
+          disabled={data.isLast}
+          onClick={() => setPage(data.number + 1)}
+        >
+          다음
+        </button>
+      </div>
     </div>
   );
 }
```

## T2 검색어를 키에 넣고 제목으로 찾기
커밋: da945ef

| 파일 | 변경 |
|---|---|
| src/pages/Home.jsx | 고침 |

```diff
// src/pages/Home.jsx
@@ -7,6 +7,8 @@ import Loading from "../components/Loading";
 export default function Home() {
   // 지금 보는 페이지 번호다. 서버는 0부터 센다
   const [page, setPage] = useState(0);
+  // 검색창에 친 글자다. 제목에 이 글자가 든 글만 받는다
+  const [keyword, setKeyword] = useState("");
 
   // 목록을 캐시에서 꺼내 그린다
   // 캐시에 없거나 stale이면 queryFn으로 서버에서 받아 캐시에 넣는다
@@ -15,14 +17,14 @@ export default function Home() {
   const { data, isPending, isError } = useQuery({
     // 캐시 칸의 이름이다
     // ["boards"] 아래에 두면 글에 관한 키를 한 묶음으로 고를 수 있다
-    // 페이지마다 받는 글이 달라서 키에 page를 넣는다. 페이지마다 캐시 칸이 따로 생긴다
-    // 쓰기 뒤 ["boards", "list"]를 무효화하면 앞부분이 같은 모든 페이지 키에 걸린다
-    queryKey: ["boards", "list", { page }],
+    // 페이지와 검색어마다 받는 글이 달라서 키에 page와 keyword를 넣는다. 둘마다 캐시 칸이 따로 생긴다
+    // 쓰기 뒤 ["boards", "list"]를 무효화하면 앞부분이 같은 모든 페이지와 검색 키에 걸린다
+    queryKey: ["boards", "list", { page, keyword }],
     // 캐시에 넣을 데이터를 서버에서 받아 돌려준다
-    // params는 주소 뒤에 ?page=0처럼 붙는다
+    // params는 주소 뒤에 ?page=0&keyword=처럼 붙는다
     // 글 목록과 함께 isFirst, isLast, totalPage, number를 쓰려고 body 전체를 돌려준다
     queryFn: async () => {
-      const res = await http.get("/", { params: { page } });
+      const res = await http.get("/", { params: { page, keyword } });
       return res.data.body;
     },
   });
@@ -38,6 +40,16 @@ export default function Home() {
 
   return (
     <div>
+      <input
+        className="input w-full mb-8"
+        placeholder="제목 검색"
+        value={keyword}
+        onChange={(e) => {
+          setKeyword(e.target.value);
+          // 검색어가 바뀌면 결과의 첫 페이지부터 본다
+          setPage(0);
+        }}
+      />
       <div className="grid grid-cols-3 gap-8">
         {data.boards.map((board) => (
           <BoardCard key={board.id} id={board.id} title={board.title} />
```

## T3 검색 결과가 없으면 안내 보이기
커밋: fd49f27

| 파일 | 변경 |
|---|---|
| src/pages/Home.jsx | 고침 |

```diff
// src/pages/Home.jsx
@@ -50,11 +50,16 @@ export default function Home() {
           setPage(0);
         }}
       />
-      <div className="grid grid-cols-3 gap-8">
-        {data.boards.map((board) => (
-          <BoardCard key={board.id} id={board.id} title={board.title} />
-        ))}
-      </div>
+      {/* 받은 글이 없으면 빈 목록 대신 안내를 보인다 */}
+      {data.boards.length === 0 ? (
+        <p className="text-center">검색 결과가 없습니다</p>
+      ) : (
+        <div className="grid grid-cols-3 gap-8">
+          {data.boards.map((board) => (
+            <BoardCard key={board.id} id={board.id} title={board.title} />
+          ))}
+        </div>
+      )}
       {/* number는 서버가 돌려준 지금 페이지 번호다. 화면에는 1부터 보인다 */}
       <div className="flex justify-center items-center gap-4 mt-8">
         <button
```

## T4 받는 동안 이전 목록 유지하기
커밋: c34f7bf

| 파일 | 변경 |
|---|---|
| src/pages/Home.jsx | 고침 |

```diff
// src/pages/Home.jsx
@@ -1,5 +1,5 @@
 import { useState } from "react";
-import { useQuery } from "@tanstack/react-query";
+import { keepPreviousData, useQuery } from "@tanstack/react-query";
 import http from "../api/http";
 import BoardCard from "../components/BoardCard";
 import Loading from "../components/Loading";
@@ -27,6 +27,12 @@ export default function Home() {
       const res = await http.get("/", { params: { page, keyword } });
       return res.data.body;
     },
+    // 새 키의 데이터가 올 때까지 바로 앞 키의 데이터를 대신 보인다 (placeholderData)
+    // 이것이 없으면 페이지나 검색어가 바뀔 때마다 새 키에 데이터가 없어 isPending이 된다
+    // 그러면 화면이 로딩 표시로 바뀌며 검색창도 사라졌다 다시 그려져 커서가 빠진다
+    // 보일 데이터가 있으니 isPending이 되지 않고, 응답이 오면 목록만 새것으로 바뀐다
+    // 처음 들어올 때는 앞 키의 데이터도 없어서 로딩 표시를 보인다
+    placeholderData: keepPreviousData,
   });
 
   if (isPending) {
```

## 테스트 보강
커밋: 4697f11

- 학생 코드 변경 없음

## T5 조회 실패 주석 바로잡기
커밋: 0247571

| 파일 | 변경 |
|---|---|
| src/pages/Home.jsx | 고침 |

```diff
// src/pages/Home.jsx
@@ -39,7 +39,9 @@ export default function Home() {
     return <Loading />;
   }
 
-  // 받기에 실패하면 data가 없다. 연결 실패는 토스트가 알렸으니 화면을 비워 둔다
+  // 받기에 실패하면 화면을 비운다. 연결 실패는 토스트가 알린다
+  // 처음 받기에 실패하면 data가 없어서 그대로 그리면 data.boards에서 깨진다
+  // 받아 둔 목록이 있는데 다시 받기에 실패해도 isError가 true라서 목록을 비운다
   if (isError) {
     return null;
   }
```

## 테스트 보강
커밋: 4b91a1e

- 학생 코드 변경 없음
