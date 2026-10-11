# screens 코드 요약

## T1 홈에 글 카드 3개 놓기
커밋: 3b8a410

| 파일 | 변경 |
|---|---|
| src/pages/Home.jsx | 고침 |

```diff
// src/pages/Home.jsx
@@ -1,3 +1,15 @@
 export default function Home() {
-  return <h1>홈</h1>;
+  return (
+    <div className="grid grid-cols-3 gap-8">
+      <div className="card border">
+        <div className="card-body">제목1</div>
+      </div>
+      <div className="card border">
+        <div className="card-body">제목2</div>
+      </div>
+      <div className="card border">
+        <div className="card-body">제목3</div>
+      </div>
+    </div>
+  );
 }
```

## T2 글 상세 화면 그리고 카드에서 잇기
커밋: bb6ccc0

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |
| src/pages/Detail.jsx | 새로 |
| src/pages/Home.jsx | 고침 |

```diff
// src/App.jsx
@@ -1,12 +1,16 @@
 import { createBrowserRouter, RouterProvider } from "react-router-dom";
 import Layout from "./components/Layout";
 import Home from "./pages/Home";
+import Detail from "./pages/Detail";
 
 const router = createBrowserRouter([
   {
     path: "/",
     element: <Layout />,
-    children: [{ index: true, element: <Home /> }],
+    children: [
+      { index: true, element: <Home /> },
+      { path: "board/:id", element: <Detail /> },
+    ],
   },
 ]);
 
```

```jsx
// src/pages/Detail.jsx
export default function Detail() {
  return (
    <div>
      <h1 className="text-2xl font-bold">제목1</h1>
      <p>작성자 ssar</p>
      <p className="my-8">내용1</p>
      <div className="flex gap-2">
        <button className="btn">수정</button>
        <button className="btn">삭제</button>
      </div>

      <hr className="my-8" />

      <h2 className="font-bold">댓글</h2>
      <ul className="list">
        <li className="list-row">
          <span>cos</span>
          <span>댓글1</span>
          <button className="btn btn-ghost btn-xs">🗑</button>
        </li>
        <li className="list-row">
          <span>love</span>
          <span>댓글2</span>
          <button className="btn btn-ghost btn-xs">🗑</button>
        </li>
      </ul>
      <form className="flex gap-2 mt-4">
        <input className="input flex-1" placeholder="댓글을 입력하세요" />
        <button className="btn">등록</button>
      </form>
    </div>
  );
}
```

```diff
// src/pages/Home.jsx
@@ -1,14 +1,22 @@
+import { Link } from "react-router-dom";
+
 export default function Home() {
   return (
     <div className="grid grid-cols-3 gap-8">
       <div className="card border">
-        <div className="card-body">제목1</div>
+        <div className="card-body">
+          <Link to="/board/1">제목1</Link>
+        </div>
       </div>
       <div className="card border">
-        <div className="card-body">제목2</div>
+        <div className="card-body">
+          <Link to="/board/2">제목2</Link>
+        </div>
       </div>
       <div className="card border">
-        <div className="card-body">제목3</div>
+        <div className="card-body">
+          <Link to="/board/3">제목3</Link>
+        </div>
       </div>
     </div>
   );
```

## T3 글쓰기 화면 그리기
커밋: 31129d1

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |
| src/pages/SaveForm.jsx | 새로 |

```diff
// src/App.jsx
@@ -2,6 +2,7 @@ import { createBrowserRouter, RouterProvider } from "react-router-dom";
 import Layout from "./components/Layout";
 import Home from "./pages/Home";
 import Detail from "./pages/Detail";
+import SaveForm from "./pages/SaveForm";
 
 const router = createBrowserRouter([
   {
@@ -10,6 +11,7 @@ const router = createBrowserRouter([
     children: [
       { index: true, element: <Home /> },
       { path: "board/:id", element: <Detail /> },
+      { path: "save-form", element: <SaveForm /> },
     ],
   },
 ]);
```

```jsx
// src/pages/SaveForm.jsx
export default function SaveForm() {
  return (
    <form className="card border max-w-sm mx-auto p-8 gap-4">
      <h1 className="text-2xl font-bold">글쓰기</h1>
      <input className="input" placeholder="제목" />
      <textarea className="textarea" placeholder="내용" />
      <button className="btn">글쓰기</button>
    </form>
  );
}
```

## T4 수정 화면 그리고 상세에서 잇기
커밋: ed32f68

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |
| src/pages/Detail.jsx | 고침 |
| src/pages/UpdateForm.jsx | 새로 |

```diff
// src/App.jsx
@@ -3,6 +3,7 @@ import Layout from "./components/Layout";
 import Home from "./pages/Home";
 import Detail from "./pages/Detail";
 import SaveForm from "./pages/SaveForm";
+import UpdateForm from "./pages/UpdateForm";
 
 const router = createBrowserRouter([
   {
@@ -12,6 +13,7 @@ const router = createBrowserRouter([
       { index: true, element: <Home /> },
       { path: "board/:id", element: <Detail /> },
       { path: "save-form", element: <SaveForm /> },
+      { path: "update-form/:id", element: <UpdateForm /> },
     ],
   },
 ]);
```

```diff
// src/pages/Detail.jsx
@@ -1,3 +1,5 @@
+import { Link } from "react-router-dom";
+
 export default function Detail() {
   return (
     <div>
@@ -5,7 +7,9 @@ export default function Detail() {
       <p>작성자 ssar</p>
       <p className="my-8">내용1</p>
       <div className="flex gap-2">
-        <button className="btn">수정</button>
+        <Link to="/update-form/1" className="btn">
+          수정
+        </Link>
         <button className="btn">삭제</button>
       </div>
 
```

```jsx
// src/pages/UpdateForm.jsx
export default function UpdateForm() {
  return (
    <form className="card border max-w-sm mx-auto p-8 gap-4">
      <h1 className="text-2xl font-bold">글 수정</h1>
      <input className="input" placeholder="제목" />
      <textarea className="textarea" placeholder="내용" />
      <button className="btn">수정하기</button>
    </form>
  );
}
```

## T5 로그인 화면 그리기
커밋: e954eab

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |
| src/pages/LoginForm.jsx | 새로 |

```diff
// src/App.jsx
@@ -4,6 +4,7 @@ import Home from "./pages/Home";
 import Detail from "./pages/Detail";
 import SaveForm from "./pages/SaveForm";
 import UpdateForm from "./pages/UpdateForm";
+import LoginForm from "./pages/LoginForm";
 
 const router = createBrowserRouter([
   {
@@ -14,6 +15,7 @@ const router = createBrowserRouter([
       { path: "board/:id", element: <Detail /> },
       { path: "save-form", element: <SaveForm /> },
       { path: "update-form/:id", element: <UpdateForm /> },
+      { path: "login-form", element: <LoginForm /> },
     ],
   },
 ]);
```

```jsx
// src/pages/LoginForm.jsx
export default function LoginForm() {
  return (
    <form className="card border max-w-sm mx-auto p-8 gap-4">
      <h1 className="text-2xl font-bold">로그인</h1>
      <input className="input" placeholder="아이디" />
      <input className="input" type="password" placeholder="비밀번호" />
      <button className="btn">로그인</button>
    </form>
  );
}
```

## T6 회원가입 화면 그리기
커밋: 17bad67

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |
| src/pages/JoinForm.jsx | 새로 |

```diff
// src/App.jsx
@@ -5,6 +5,7 @@ import Detail from "./pages/Detail";
 import SaveForm from "./pages/SaveForm";
 import UpdateForm from "./pages/UpdateForm";
 import LoginForm from "./pages/LoginForm";
+import JoinForm from "./pages/JoinForm";
 
 const router = createBrowserRouter([
   {
@@ -16,6 +17,7 @@ const router = createBrowserRouter([
       { path: "save-form", element: <SaveForm /> },
       { path: "update-form/:id", element: <UpdateForm /> },
       { path: "login-form", element: <LoginForm /> },
+      { path: "join-form", element: <JoinForm /> },
     ],
   },
 ]);
```

```jsx
// src/pages/JoinForm.jsx
export default function JoinForm() {
  return (
    <form className="card border max-w-sm mx-auto p-8 gap-4">
      <h1 className="text-2xl font-bold">회원가입</h1>
      <input className="input" placeholder="아이디" />
      <input className="input" type="password" placeholder="비밀번호" />
      <input className="input" placeholder="이메일" />
      <button className="btn">가입하기</button>
    </form>
  );
}
```

## T7 내 정보 화면 그리기
커밋: 27ff319

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |
| src/pages/UserInfo.jsx | 새로 |

```diff
// src/App.jsx
@@ -6,6 +6,7 @@ import SaveForm from "./pages/SaveForm";
 import UpdateForm from "./pages/UpdateForm";
 import LoginForm from "./pages/LoginForm";
 import JoinForm from "./pages/JoinForm";
+import UserInfo from "./pages/UserInfo";
 
 const router = createBrowserRouter([
   {
@@ -18,6 +19,7 @@ const router = createBrowserRouter([
       { path: "update-form/:id", element: <UpdateForm /> },
       { path: "login-form", element: <LoginForm /> },
       { path: "join-form", element: <JoinForm /> },
+      { path: "user-info", element: <UserInfo /> },
     ],
   },
 ]);
```

```jsx
// src/pages/UserInfo.jsx
export default function UserInfo() {
  return (
    <form className="card border max-w-sm mx-auto p-8 gap-4">
      <h1 className="text-2xl font-bold">내 정보</h1>
      <input className="input" value="ssar" readOnly />
      <input className="input" placeholder="이메일" />
      <input className="input" type="password" placeholder="새 비밀번호" />
      <button className="btn">수정하기</button>
    </form>
  );
}
```

## 학생 코드 밖
- 테스트 작성 커밋 f24760e: 학생 코드 변경 없음
- 테스트 보강 커밋 c1032ba: 학생 코드 변경 없음
