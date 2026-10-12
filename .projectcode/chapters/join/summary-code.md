# join 코드 요약

## 테스트 작성
커밋: ce3c1cd
- 학생 코드 변경 없음

## T1 입력값을 state로 기억하기
커밋: 90b1568

| 파일 | 변경 |
|---|---|
| src/pages/JoinForm.jsx | 고침 |

```diff
// src/pages/JoinForm.jsx
@@ -1,12 +1,30 @@
+import { useState } from "react";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
 
 export default function JoinForm() {
+  const [username, setUsername] = useState("");
+  const [password, setPassword] = useState("");
+  const [email, setEmail] = useState("");
+
   return (
     <FormCard title="회원가입">
-      <Input placeholder="아이디" />
-      <Input type="password" placeholder="비밀번호" />
-      <Input placeholder="이메일" />
+      <Input
+        placeholder="아이디"
+        value={username}
+        onChange={(e) => setUsername(e.target.value)}
+      />
+      <Input
+        type="password"
+        placeholder="비밀번호"
+        value={password}
+        onChange={(e) => setPassword(e.target.value)}
+      />
+      <Input
+        placeholder="이메일"
+        value={email}
+        onChange={(e) => setEmail(e.target.value)}
+      />
       <button className="btn">가입하기</button>
     </FormCard>
   );
```

## T2 가입하기를 누르면 서버에 보내기
커밋: 9628998

| 파일 | 변경 |
|---|---|
| src/components/FormCard.jsx | 고침 |
| src/pages/JoinForm.jsx | 고침 |

```diff
// src/components/FormCard.jsx
@@ -1,6 +1,9 @@
-export default function FormCard({ title, children }) {
+export default function FormCard({ title, onSubmit, children }) {
   return (
-    <form className="card border max-w-sm mx-auto p-8 gap-4">
+    <form
+      onSubmit={onSubmit}
+      className="card border max-w-sm mx-auto p-8 gap-4"
+    >
       <h1 className="text-2xl font-bold">{title}</h1>
       {children}
     </form>
```

```diff
// src/pages/JoinForm.jsx
@@ -1,4 +1,5 @@
 import { useState } from "react";
+import axios from "axios";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
 
@@ -7,8 +8,17 @@ export default function JoinForm() {
   const [password, setPassword] = useState("");
   const [email, setEmail] = useState("");
 
+  async function handleSubmit(e) {
+    e.preventDefault();
+    await axios.post("http://localhost:8080/join", {
+      username,
+      password,
+      email,
+    });
+  }
+
   return (
-    <FormCard title="회원가입">
+    <FormCard title="회원가입" onSubmit={handleSubmit}>
       <Input
         placeholder="아이디"
         value={username}
```

## T3 가입에 성공하면 안내를 띄우고 로그인 화면으로 가기
커밋: 437fba4

| 파일 | 변경 |
|---|---|
| src/pages/JoinForm.jsx | 고침 |

```diff
// src/pages/JoinForm.jsx
@@ -1,5 +1,6 @@
 import { useState } from "react";
 import axios from "axios";
+import { useNavigate } from "react-router-dom";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
 
@@ -7,6 +8,7 @@ export default function JoinForm() {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [email, setEmail] = useState("");
+  const navigate = useNavigate();
 
   async function handleSubmit(e) {
     e.preventDefault();
@@ -15,6 +17,8 @@ export default function JoinForm() {
       password,
       email,
     });
+    alert("회원가입 완료");
+    navigate("/login-form");
   }
 
   return (
```

## T4 입력값을 객체 하나로 묶기
커밋: 5bb27a4

| 파일 | 변경 |
|---|---|
| src/pages/JoinForm.jsx | 고침 |

```diff
// src/pages/JoinForm.jsx
@@ -5,18 +5,16 @@ import FormCard from "../components/FormCard";
 import Input from "../components/Input";
 
 export default function JoinForm() {
-  const [username, setUsername] = useState("");
-  const [password, setPassword] = useState("");
-  const [email, setEmail] = useState("");
+  const [form, setForm] = useState({ username: "", password: "", email: "" });
   const navigate = useNavigate();
 
+  function handleChange(e) {
+    setForm({ ...form, [e.target.name]: e.target.value });
+  }
+
   async function handleSubmit(e) {
     e.preventDefault();
-    await axios.post("http://localhost:8080/join", {
-      username,
-      password,
-      email,
-    });
+    await axios.post("http://localhost:8080/join", form);
     alert("회원가입 완료");
     navigate("/login-form");
   }
@@ -24,20 +22,23 @@ export default function JoinForm() {
   return (
     <FormCard title="회원가입" onSubmit={handleSubmit}>
       <Input
+        name="username"
         placeholder="아이디"
-        value={username}
-        onChange={(e) => setUsername(e.target.value)}
+        value={form.username}
+        onChange={handleChange}
       />
       <Input
+        name="password"
         type="password"
         placeholder="비밀번호"
-        value={password}
-        onChange={(e) => setPassword(e.target.value)}
+        value={form.password}
+        onChange={handleChange}
       />
       <Input
+        name="email"
         placeholder="이메일"
-        value={email}
-        onChange={(e) => setEmail(e.target.value)}
+        value={form.email}
+        onChange={handleChange}
       />
       <button className="btn">가입하기</button>
     </FormCard>
```
