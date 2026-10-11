# component-split 코드 요약

## 테스트 작성
커밋: ac61ddb
- 학생 코드 변경 없음

## T1 글 카드를 컴포넌트로 빼고 props로 넘기기
커밋: 3175b9c

| 파일 | 변경 |
|---|---|
| src/components/BoardCard.jsx | 새로 |
| src/pages/Home.jsx | 고침 |

```jsx
// src/components/BoardCard.jsx
import { Link } from "react-router-dom";

export default function BoardCard({ id, title }) {
  return (
    <div className="card border">
      <div className="card-body">
        <Link to={`/board/${id}`}>{title}</Link>
      </div>
    </div>
  );
}
```

```diff
// src/pages/Home.jsx
@@ -1,23 +1,11 @@
-import { Link } from "react-router-dom";
+import BoardCard from "../components/BoardCard";
 
 export default function Home() {
   return (
     <div className="grid grid-cols-3 gap-8">
-      <div className="card border">
-        <div className="card-body">
-          <Link to="/board/1">제목1</Link>
-        </div>
-      </div>
-      <div className="card border">
-        <div className="card-body">
-          <Link to="/board/2">제목2</Link>
-        </div>
-      </div>
-      <div className="card border">
-        <div className="card-body">
-          <Link to="/board/3">제목3</Link>
-        </div>
-      </div>
+      <BoardCard id={1} title="제목1" />
+      <BoardCard id={2} title="제목2" />
+      <BoardCard id={3} title="제목3" />
     </div>
   );
 }
```

## T2 글 배열을 map으로 그리기
커밋: 477a09f

| 파일 | 변경 |
|---|---|
| src/pages/Home.jsx | 고침 |

```diff
// src/pages/Home.jsx
@@ -1,11 +1,17 @@
 import BoardCard from "../components/BoardCard";
 
 export default function Home() {
+  const boards = [
+    { id: 1, title: "제목1" },
+    { id: 2, title: "제목2" },
+    { id: 3, title: "제목3" },
+  ];
+
   return (
     <div className="grid grid-cols-3 gap-8">
-      <BoardCard id={1} title="제목1" />
-      <BoardCard id={2} title="제목2" />
-      <BoardCard id={3} title="제목3" />
+      {boards.map((board) => (
+        <BoardCard key={board.id} id={board.id} title={board.title} />
+      ))}
     </div>
   );
 }
```

## T3 댓글 줄을 컴포넌트로 빼고 map으로 그리기
커밋: db3653a

| 파일 | 변경 |
|---|---|
| src/components/ReplyItem.jsx | 새로 |
| src/pages/Detail.jsx | 고침 |

```jsx
// src/components/ReplyItem.jsx
export default function ReplyItem({ username, comment }) {
  return (
    <li className="list-row">
      <span>{username}</span>
      <span>{comment}</span>
      <button className="btn btn-ghost btn-xs">🗑</button>
    </li>
  );
}
```

```diff
// src/pages/Detail.jsx
@@ -1,6 +1,12 @@
 import { Link } from "react-router-dom";
+import ReplyItem from "../components/ReplyItem";
 
 export default function Detail() {
+  const replies = [
+    { id: 1, username: "cos", comment: "댓글1" },
+    { id: 2, username: "love", comment: "댓글2" },
+  ];
+
   return (
     <div>
       <h1 className="text-2xl font-bold">제목1</h1>
@@ -17,16 +23,13 @@ export default function Detail() {
 
       <h2 className="font-bold">댓글</h2>
       <ul className="list">
-        <li className="list-row">
-          <span>cos</span>
-          <span>댓글1</span>
-          <button className="btn btn-ghost btn-xs">🗑</button>
-        </li>
-        <li className="list-row">
-          <span>love</span>
-          <span>댓글2</span>
-          <button className="btn btn-ghost btn-xs">🗑</button>
-        </li>
+        {replies.map((reply) => (
+          <ReplyItem
+            key={reply.id}
+            username={reply.username}
+            comment={reply.comment}
+          />
+        ))}
       </ul>
       <form className="flex gap-2 mt-4">
         <input className="input flex-1" placeholder="댓글을 입력하세요" />
```

## T4 폼 틀을 컴포넌트로 빼고 children으로 넘기기
커밋: 3790629

| 파일 | 변경 |
|---|---|
| src/components/FormCard.jsx | 새로 |
| src/pages/JoinForm.jsx | 고침 |
| src/pages/LoginForm.jsx | 고침 |
| src/pages/SaveForm.jsx | 고침 |
| src/pages/UpdateForm.jsx | 고침 |
| src/pages/UserInfo.jsx | 고침 |

```jsx
// src/components/FormCard.jsx
export default function FormCard({ title, children }) {
  return (
    <form className="card border max-w-sm mx-auto p-8 gap-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
    </form>
  );
}
```

```diff
// src/pages/JoinForm.jsx
@@ -1,11 +1,12 @@
+import FormCard from "../components/FormCard";
+
 export default function JoinForm() {
   return (
-    <form className="card border max-w-sm mx-auto p-8 gap-4">
-      <h1 className="text-2xl font-bold">회원가입</h1>
+    <FormCard title="회원가입">
       <input className="input" placeholder="아이디" />
       <input className="input" type="password" placeholder="비밀번호" />
       <input className="input" placeholder="이메일" />
       <button className="btn">가입하기</button>
-    </form>
+    </FormCard>
   );
 }
```

```diff
// src/pages/LoginForm.jsx
@@ -1,10 +1,11 @@
+import FormCard from "../components/FormCard";
+
 export default function LoginForm() {
   return (
-    <form className="card border max-w-sm mx-auto p-8 gap-4">
-      <h1 className="text-2xl font-bold">로그인</h1>
+    <FormCard title="로그인">
       <input className="input" placeholder="아이디" />
       <input className="input" type="password" placeholder="비밀번호" />
       <button className="btn">로그인</button>
-    </form>
+    </FormCard>
   );
 }
```

```diff
// src/pages/SaveForm.jsx
@@ -1,10 +1,11 @@
+import FormCard from "../components/FormCard";
+
 export default function SaveForm() {
   return (
-    <form className="card border max-w-sm mx-auto p-8 gap-4">
-      <h1 className="text-2xl font-bold">글쓰기</h1>
+    <FormCard title="글쓰기">
       <input className="input" placeholder="제목" />
       <textarea className="textarea" placeholder="내용" />
       <button className="btn">글쓰기</button>
-    </form>
+    </FormCard>
   );
 }
```

```diff
// src/pages/UpdateForm.jsx
@@ -1,10 +1,11 @@
+import FormCard from "../components/FormCard";
+
 export default function UpdateForm() {
   return (
-    <form className="card border max-w-sm mx-auto p-8 gap-4">
-      <h1 className="text-2xl font-bold">글 수정</h1>
+    <FormCard title="글 수정">
       <input className="input" placeholder="제목" />
       <textarea className="textarea" placeholder="내용" />
       <button className="btn">수정하기</button>
-    </form>
+    </FormCard>
   );
 }
```

```diff
// src/pages/UserInfo.jsx
@@ -1,11 +1,12 @@
+import FormCard from "../components/FormCard";
+
 export default function UserInfo() {
   return (
-    <form className="card border max-w-sm mx-auto p-8 gap-4">
-      <h1 className="text-2xl font-bold">내 정보</h1>
+    <FormCard title="내 정보">
       <input className="input" value="ssar" readOnly />
       <input className="input" placeholder="이메일" />
       <input className="input" type="password" placeholder="새 비밀번호" />
       <button className="btn">수정하기</button>
-    </form>
+    </FormCard>
   );
 }
```

## T5 입력칸을 컴포넌트로 빼고 props 펼치기
커밋: 2738895

| 파일 | 변경 |
|---|---|
| src/components/Input.jsx | 새로 |
| src/pages/JoinForm.jsx | 고침 |
| src/pages/LoginForm.jsx | 고침 |
| src/pages/SaveForm.jsx | 고침 |
| src/pages/UpdateForm.jsx | 고침 |
| src/pages/UserInfo.jsx | 고침 |

```jsx
// src/components/Input.jsx
export default function Input(props) {
  return <input className="input" {...props} />;
}
```

```diff
// src/pages/JoinForm.jsx
@@ -1,11 +1,12 @@
 import FormCard from "../components/FormCard";
+import Input from "../components/Input";
 
 export default function JoinForm() {
   return (
     <FormCard title="회원가입">
-      <input className="input" placeholder="아이디" />
-      <input className="input" type="password" placeholder="비밀번호" />
-      <input className="input" placeholder="이메일" />
+      <Input placeholder="아이디" />
+      <Input type="password" placeholder="비밀번호" />
+      <Input placeholder="이메일" />
       <button className="btn">가입하기</button>
     </FormCard>
   );
```

```diff
// src/pages/LoginForm.jsx
@@ -1,10 +1,11 @@
 import FormCard from "../components/FormCard";
+import Input from "../components/Input";
 
 export default function LoginForm() {
   return (
     <FormCard title="로그인">
-      <input className="input" placeholder="아이디" />
-      <input className="input" type="password" placeholder="비밀번호" />
+      <Input placeholder="아이디" />
+      <Input type="password" placeholder="비밀번호" />
       <button className="btn">로그인</button>
     </FormCard>
   );
```

```diff
// src/pages/SaveForm.jsx
@@ -1,9 +1,10 @@
 import FormCard from "../components/FormCard";
+import Input from "../components/Input";
 
 export default function SaveForm() {
   return (
     <FormCard title="글쓰기">
-      <input className="input" placeholder="제목" />
+      <Input placeholder="제목" />
       <textarea className="textarea" placeholder="내용" />
       <button className="btn">글쓰기</button>
     </FormCard>
```

```diff
// src/pages/UpdateForm.jsx
@@ -1,9 +1,10 @@
 import FormCard from "../components/FormCard";
+import Input from "../components/Input";
 
 export default function UpdateForm() {
   return (
     <FormCard title="글 수정">
-      <input className="input" placeholder="제목" />
+      <Input placeholder="제목" />
       <textarea className="textarea" placeholder="내용" />
       <button className="btn">수정하기</button>
     </FormCard>
```

```diff
// src/pages/UserInfo.jsx
@@ -1,11 +1,12 @@
 import FormCard from "../components/FormCard";
+import Input from "../components/Input";
 
 export default function UserInfo() {
   return (
     <FormCard title="내 정보">
-      <input className="input" value="ssar" readOnly />
-      <input className="input" placeholder="이메일" />
-      <input className="input" type="password" placeholder="새 비밀번호" />
+      <Input value="ssar" readOnly />
+      <Input placeholder="이메일" />
+      <Input type="password" placeholder="새 비밀번호" />
       <button className="btn">수정하기</button>
     </FormCard>
   );
```

## T6 글쓰기와 수정을 글 폼 하나로 합치기
커밋: 42ec379

| 파일 | 변경 |
|---|---|
| src/components/BoardForm.jsx | 새로 |
| src/pages/SaveForm.jsx | 고침 |
| src/pages/UpdateForm.jsx | 고침 |

```jsx
// src/components/BoardForm.jsx
import FormCard from "./FormCard";
import Input from "./Input";

export default function BoardForm({ title, buttonText }) {
  return (
    <FormCard title={title}>
      <Input placeholder="제목" />
      <textarea className="textarea" placeholder="내용" />
      <button className="btn">{buttonText}</button>
    </FormCard>
  );
}
```

```diff
// src/pages/SaveForm.jsx
@@ -1,12 +1,5 @@
-import FormCard from "../components/FormCard";
-import Input from "../components/Input";
+import BoardForm from "../components/BoardForm";
 
 export default function SaveForm() {
-  return (
-    <FormCard title="글쓰기">
-      <Input placeholder="제목" />
-      <textarea className="textarea" placeholder="내용" />
-      <button className="btn">글쓰기</button>
-    </FormCard>
-  );
+  return <BoardForm title="글쓰기" buttonText="글쓰기" />;
 }
```

```diff
// src/pages/UpdateForm.jsx
@@ -1,12 +1,5 @@
-import FormCard from "../components/FormCard";
-import Input from "../components/Input";
+import BoardForm from "../components/BoardForm";
 
 export default function UpdateForm() {
-  return (
-    <FormCard title="글 수정">
-      <Input placeholder="제목" />
-      <textarea className="textarea" placeholder="내용" />
-      <button className="btn">수정하기</button>
-    </FormCard>
-  );
+  return <BoardForm title="글 수정" buttonText="수정하기" />;
 }
```
