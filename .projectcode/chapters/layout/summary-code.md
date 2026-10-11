# layout 코드 요약

## T1 라우터로 홈 화면 띄우기
커밋: 432dba1

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |
| src/pages/Home.jsx | 새로 |

```diff
// src/App.jsx
@@ -1,3 +1,8 @@
+import { createBrowserRouter, RouterProvider } from "react-router-dom";
+import Home from "./pages/Home";
+
+const router = createBrowserRouter([{ path: "/", element: <Home /> }]);
+
 export default function App() {
-  return <h1 className="text-3xl font-bold">Hello World</h1>;
+  return <RouterProvider router={router} />;
 }
```

```jsx
// src/pages/Home.jsx
export default function Home() {
  return <h1>홈</h1>;
}
```

## T2 레이아웃에 헤더 메뉴 두기
커밋: 5515382

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |
| src/components/Header.jsx | 새로 |
| src/components/Layout.jsx | 새로 |

```diff
// src/App.jsx
@@ -1,7 +1,14 @@
 import { createBrowserRouter, RouterProvider } from "react-router-dom";
+import Layout from "./components/Layout";
 import Home from "./pages/Home";
 
-const router = createBrowserRouter([{ path: "/", element: <Home /> }]);
+const router = createBrowserRouter([
+  {
+    path: "/",
+    element: <Layout />,
+    children: [{ index: true, element: <Home /> }],
+  },
+]);
 
 export default function App() {
   return <RouterProvider router={router} />;
```

```jsx
// src/components/Header.jsx
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <ul className="menu menu-horizontal">
      <li>
        <NavLink to="/">홈</NavLink>
      </li>
      <li>
        <NavLink to="/login-form">로그인</NavLink>
      </li>
      <li>
        <NavLink to="/join-form">회원가입</NavLink>
      </li>
      <li>
        <NavLink to="/save-form">글쓰기</NavLink>
      </li>
      <li>
        <NavLink to="/user-info">내 정보</NavLink>
      </li>
    </ul>
  );
}
```

```jsx
// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}
```

## T3 바깥 여백과 구분선 주기
커밋: 7227d90

| 파일 | 변경 |
|---|---|
| src/components/Layout.jsx | 고침 |

```diff
// src/components/Layout.jsx
@@ -3,8 +3,9 @@ import Header from "./Header";
 
 export default function Layout() {
   return (
-    <div>
+    <div className="max-w-3xl mx-auto p-8">
       <Header />
+      <hr className="mb-8" />
       <Outlet />
     </div>
   );
```

## T4 지금 메뉴 강조하기
커밋: 788993b

| 파일 | 변경 |
|---|---|
| src/components/Header.jsx | 고침 |
| src/index.css | 고침 |

```diff
// src/components/Header.jsx
@@ -4,7 +4,9 @@ export default function Header() {
   return (
     <ul className="menu menu-horizontal">
       <li>
-        <NavLink to="/">홈</NavLink>
+        <NavLink to="/" end>
+          홈
+        </NavLink>
       </li>
       <li>
         <NavLink to="/login-form">로그인</NavLink>
```

```diff
// src/index.css
@@ -1,2 +1,6 @@
 @import "tailwindcss";
 @plugin "daisyui";
+
+.menu .active {
+  @apply menu-active;
+}
```

## 학생 코드 밖
- 테스트 작성 커밋 2a3ec59: 학생 코드 변경 없음
