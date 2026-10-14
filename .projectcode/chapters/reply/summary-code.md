# reply 코드 요약

## 테스트 작성
커밋: 77421d2
- 학생 코드 변경 없음

## T1 내 댓글에만 휴지통 보이기
커밋: dbef290

| 파일 | 변경 |
|---|---|
| src/components/ReplyItem.jsx | 고침 |
| src/pages/Detail.jsx | 고침 |

```diff
// src/components/ReplyItem.jsx
@@ -1,9 +1,9 @@
-export default function ReplyItem({ username, comment }) {
+export default function ReplyItem({ username, comment, owner }) {
   return (
     <li className="list-row">
       <span>{username}</span>
       <span>{comment}</span>
-      <button className="btn btn-ghost btn-xs">🗑</button>
+      {owner && <button className="btn btn-ghost btn-xs">🗑</button>}
     </li>
   );
 }
```

```diff
// src/pages/Detail.jsx
@@ -52,6 +52,7 @@ export default function Detail() {
             key={reply.id}
             username={reply.username}
             comment={reply.comment}
+            owner={reply.owner}
           />
         ))}
       </ul>
```

## T2 댓글 입력값을 state로 기억하기
커밋: e5a2346

| 파일 | 변경 |
|---|---|
| src/pages/Detail.jsx | 고침 |

```diff
// src/pages/Detail.jsx
@@ -12,6 +12,7 @@ export default function Detail() {
     owner: false,
     replies: [],
   });
+  const [comment, setComment] = useState("");
   const navigate = useNavigate();
 
   useEffect(() => {
@@ -57,7 +58,12 @@ export default function Detail() {
         ))}
       </ul>
       <form className="flex gap-2 mt-4">
-        <input className="input flex-1" placeholder="댓글을 입력하세요" />
+        <input
+          className="input flex-1"
+          placeholder="댓글을 입력하세요"
+          value={comment}
+          onChange={(e) => setComment(e.target.value)}
+        />
         <button className="btn">등록</button>
       </form>
     </div>
```

## T3 등록하면 서버에 보내고 상세 다시 받기
커밋: 0fd811d

| 파일 | 변경 |
|---|---|
| src/pages/Detail.jsx | 고침 |

```diff
// src/pages/Detail.jsx
@@ -15,11 +15,12 @@ export default function Detail() {
   const [comment, setComment] = useState("");
   const navigate = useNavigate();
 
+  async function loadBoard() {
+    const res = await http.get(`/api/boards/${id}`);
+    setBoard(res.data.body);
+  }
+
   useEffect(() => {
-    async function loadBoard() {
-      const res = await http.get(`/api/boards/${id}`);
-      setBoard(res.data.body);
-    }
     loadBoard();
   }, [id]);
 
@@ -28,6 +29,12 @@ export default function Detail() {
     navigate("/");
   }
 
+  async function handleReplySubmit(e) {
+    e.preventDefault();
+    await http.post("/api/replies", { boardId: id, comment });
+    loadBoard();
+  }
+
   return (
     <div>
       <h1 className="text-2xl font-bold">{board.title}</h1>
@@ -57,7 +64,7 @@ export default function Detail() {
           />
         ))}
       </ul>
-      <form className="flex gap-2 mt-4">
+      <form className="flex gap-2 mt-4" onSubmit={handleReplySubmit}>
         <input
           className="input flex-1"
           placeholder="댓글을 입력하세요"
```

## T4 등록 뒤 입력칸 비우기
커밋: b8ac0fe

| 파일 | 변경 |
|---|---|
| src/pages/Detail.jsx | 고침 |

```diff
// src/pages/Detail.jsx
@@ -32,6 +32,7 @@ export default function Detail() {
   async function handleReplySubmit(e) {
     e.preventDefault();
     await http.post("/api/replies", { boardId: id, comment });
+    setComment("");
     loadBoard();
   }
 
```

## T5 휴지통을 누르면 지우고 상세 다시 받기
커밋: 905a959

| 파일 | 변경 |
|---|---|
| src/components/ReplyItem.jsx | 고침 |
| src/pages/Detail.jsx | 고침 |

```diff
// src/components/ReplyItem.jsx
@@ -1,9 +1,13 @@
-export default function ReplyItem({ username, comment, owner }) {
+export default function ReplyItem({ username, comment, owner, onDelete }) {
   return (
     <li className="list-row">
       <span>{username}</span>
       <span>{comment}</span>
-      {owner && <button className="btn btn-ghost btn-xs">🗑</button>}
+      {owner && (
+        <button className="btn btn-ghost btn-xs" onClick={onDelete}>
+          🗑
+        </button>
+      )}
     </li>
   );
 }
```

```diff
// src/pages/Detail.jsx
@@ -36,6 +36,11 @@ export default function Detail() {
     loadBoard();
   }
 
+  async function handleReplyDelete(replyId) {
+    await http.delete(`/api/replies/${replyId}`);
+    loadBoard();
+  }
+
   return (
     <div>
       <h1 className="text-2xl font-bold">{board.title}</h1>
@@ -62,6 +67,7 @@ export default function Detail() {
             username={reply.username}
             comment={reply.comment}
             owner={reply.owner}
+            onDelete={() => handleReplyDelete(reply.id)}
           />
         ))}
       </ul>
```

## 테스트 보강
커밋: 47c0263
- 학생 코드 변경 없음

## 수렴 점검 반영
커밋: 2585548
- 학생 코드 변경 없음
