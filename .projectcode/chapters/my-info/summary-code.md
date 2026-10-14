# my-info 코드 요약

## 테스트 작성
커밋: a5691cb
- 학생 코드 변경 없음

## T1 내 정보 입력값을 객체로 기억하기
커밋: 94fa920

| 파일 | 변경 |
|---|---|
| src/pages/UserInfo.jsx | 고침 |

```diff
// src/pages/UserInfo.jsx
@@ -1,12 +1,30 @@
+import { useState } from "react";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
 
 export default function UserInfo() {
+  const [form, setForm] = useState({ username: "", email: "", password: "" });
+
+  function handleChange(e) {
+    setForm({ ...form, [e.target.name]: e.target.value });
+  }
+
   return (
     <FormCard title="내 정보">
-      <Input value="ssar" readOnly />
-      <Input placeholder="이메일" />
-      <Input type="password" placeholder="새 비밀번호" />
+      <Input value={form.username} readOnly />
+      <Input
+        name="email"
+        placeholder="이메일"
+        value={form.email}
+        onChange={handleChange}
+      />
+      <Input
+        name="password"
+        type="password"
+        placeholder="새 비밀번호"
+        value={form.password}
+        onChange={handleChange}
+      />
       <button className="btn">수정하기</button>
     </FormCard>
   );
```

## T2 내 정보를 받아 아이디와 이메일 채우기
커밋: 39b50a2

| 파일 | 변경 |
|---|---|
| src/pages/UserInfo.jsx | 고침 |

```diff
// src/pages/UserInfo.jsx
@@ -1,10 +1,23 @@
-import { useState } from "react";
+import { useEffect, useState } from "react";
+import http from "../api/http";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
 
 export default function UserInfo() {
   const [form, setForm] = useState({ username: "", email: "", password: "" });
 
+  useEffect(() => {
+    async function loadUser() {
+      const res = await http.get("/api/user");
+      setForm({
+        username: res.data.body.username,
+        email: res.data.body.email,
+        password: "",
+      });
+    }
+    loadUser();
+  }, []);
+
   function handleChange(e) {
     setForm({ ...form, [e.target.name]: e.target.value });
   }
```

## T3 수정하기를 누르면 서버에 보내고 홈으로 가기
커밋: ca83687

| 파일 | 변경 |
|---|---|
| src/pages/UserInfo.jsx | 고침 |

```diff
// src/pages/UserInfo.jsx
@@ -1,10 +1,12 @@
 import { useEffect, useState } from "react";
+import { useNavigate } from "react-router-dom";
 import http from "../api/http";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
 
 export default function UserInfo() {
   const [form, setForm] = useState({ username: "", email: "", password: "" });
+  const navigate = useNavigate();
 
   useEffect(() => {
     async function loadUser() {
@@ -22,8 +24,14 @@ export default function UserInfo() {
     setForm({ ...form, [e.target.name]: e.target.value });
   }
 
+  async function handleSubmit(e) {
+    e.preventDefault();
+    await http.put("/api/user", { email: form.email, password: form.password });
+    navigate("/");
+  }
+
   return (
-    <FormCard title="내 정보">
+    <FormCard title="내 정보" onSubmit={handleSubmit}>
       <Input value={form.username} readOnly />
       <Input
         name="email"
```

## 수렴 점검
커밋: 790d3cc
- 학생 코드 변경 없음
