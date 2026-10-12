# login 코드 요약

## 테스트 작성
커밋: 30d4fe3
- 학생 코드 변경 없음

## T1 로그인 입력값을 객체로 기억하기
커밋: 249f4cb

| 파일 | 변경 |
|---|---|
| src/pages/LoginForm.jsx | 고침 |

```diff
// src/pages/LoginForm.jsx
@@ -1,11 +1,29 @@
+import { useState } from "react";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
 
 export default function LoginForm() {
+  const [form, setForm] = useState({ username: "", password: "" });
+
+  function handleChange(e) {
+    setForm({ ...form, [e.target.name]: e.target.value });
+  }
+
   return (
     <FormCard title="로그인">
-      <Input placeholder="아이디" />
-      <Input type="password" placeholder="비밀번호" />
+      <Input
+        name="username"
+        placeholder="아이디"
+        value={form.username}
+        onChange={handleChange}
+      />
+      <Input
+        name="password"
+        type="password"
+        placeholder="비밀번호"
+        value={form.password}
+        onChange={handleChange}
+      />
       <button className="btn">로그인</button>
     </FormCard>
   );
```

## T2 로그인을 누르면 서버에 보내기
커밋: 6d84b4f

| 파일 | 변경 |
|---|---|
| src/pages/LoginForm.jsx | 고침 |

```diff
// src/pages/LoginForm.jsx
@@ -1,4 +1,5 @@
 import { useState } from "react";
+import axios from "axios";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
 
@@ -9,8 +10,13 @@ export default function LoginForm() {
     setForm({ ...form, [e.target.name]: e.target.value });
   }
 
+  async function handleSubmit(e) {
+    e.preventDefault();
+    await axios.post("http://localhost:8080/login", form);
+  }
+
   return (
-    <FormCard title="로그인">
+    <FormCard title="로그인" onSubmit={handleSubmit}>
       <Input
         name="username"
         placeholder="아이디"
```

## T3 로그인 상태를 스토어에 기억하고 홈으로 가기
커밋: 74b267d

| 파일 | 변경 |
|---|---|
| src/pages/LoginForm.jsx | 고침 |
| src/store/authStore.jsx | 새로 |

```diff
// src/pages/LoginForm.jsx
@@ -1,10 +1,14 @@
 import { useState } from "react";
 import axios from "axios";
+import { useNavigate } from "react-router-dom";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
+import { useAuthStore } from "../store/authStore";
 
 export default function LoginForm() {
   const [form, setForm] = useState({ username: "", password: "" });
+  const login = useAuthStore((state) => state.login);
+  const navigate = useNavigate();
 
   function handleChange(e) {
     setForm({ ...form, [e.target.name]: e.target.value });
@@ -12,7 +16,10 @@ export default function LoginForm() {
 
   async function handleSubmit(e) {
     e.preventDefault();
-    await axios.post("http://localhost:8080/login", form);
+    const res = await axios.post("http://localhost:8080/login", form);
+    const jwt = res.headers.authorization;
+    login(jwt, form.username);
+    navigate("/");
   }
 
   return (
```

```jsx
// src/store/authStore.jsx
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isLogin: false,
  jwt: "",
  username: "",
  login: (jwt, username) => set({ isLogin: true, jwt, username }),
}));
```

## T4 로그인 여부로 헤더 메뉴 바꾸기
커밋: 757ed9b

| 파일 | 변경 |
|---|---|
| src/components/Header.jsx | 고침 |

```diff
// src/components/Header.jsx
@@ -1,6 +1,10 @@
 import { NavLink } from "react-router-dom";
+import { useAuthStore } from "../store/authStore";
 
 export default function Header() {
+  const isLogin = useAuthStore((state) => state.isLogin);
+  const username = useAuthStore((state) => state.username);
+
   return (
     <ul className="menu menu-horizontal">
       <li>
@@ -8,18 +12,31 @@ export default function Header() {
           홈
         </NavLink>
       </li>
-      <li>
-        <NavLink to="/login-form">로그인</NavLink>
-      </li>
-      <li>
-        <NavLink to="/join-form">회원가입</NavLink>
-      </li>
-      <li>
-        <NavLink to="/save-form">글쓰기</NavLink>
-      </li>
-      <li>
-        <NavLink to="/user-info">내 정보</NavLink>
-      </li>
+      {isLogin ? (
+        <>
+          <li>
+            <NavLink to="/save-form">글쓰기</NavLink>
+          </li>
+          <li>
+            <NavLink to="/user-info">내 정보</NavLink>
+          </li>
+          <li>
+            <button>로그아웃</button>
+          </li>
+          <li>
+            <span>{username}님</span>
+          </li>
+        </>
+      ) : (
+        <>
+          <li>
+            <NavLink to="/login-form">로그인</NavLink>
+          </li>
+          <li>
+            <NavLink to="/join-form">회원가입</NavLink>
+          </li>
+        </>
+      )}
     </ul>
   );
 }
```

## T5 로그아웃하면 로그인 상태 비우기
커밋: 9a4a580

| 파일 | 변경 |
|---|---|
| src/components/Header.jsx | 고침 |
| src/store/authStore.jsx | 고침 |

```diff
// src/components/Header.jsx
@@ -1,9 +1,16 @@
-import { NavLink } from "react-router-dom";
+import { NavLink, useNavigate } from "react-router-dom";
 import { useAuthStore } from "../store/authStore";
 
 export default function Header() {
   const isLogin = useAuthStore((state) => state.isLogin);
   const username = useAuthStore((state) => state.username);
+  const logout = useAuthStore((state) => state.logout);
+  const navigate = useNavigate();
+
+  function handleLogout() {
+    logout();
+    navigate("/");
+  }
 
   return (
     <ul className="menu menu-horizontal">
@@ -21,7 +28,7 @@ export default function Header() {
             <NavLink to="/user-info">내 정보</NavLink>
           </li>
           <li>
-            <button>로그아웃</button>
+            <button onClick={handleLogout}>로그아웃</button>
           </li>
           <li>
             <span>{username}님</span>
```

```diff
// src/store/authStore.jsx
@@ -5,4 +5,5 @@ export const useAuthStore = create((set) => ({
   jwt: "",
   username: "",
   login: (jwt, username) => set({ isLogin: true, jwt, username }),
+  logout: () => set({ isLogin: false, jwt: "", username: "" }),
 }));
```

## 테스트 보강
커밋: 13be357
- 학생 코드 변경 없음
