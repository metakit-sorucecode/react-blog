# form-hook 코드 요약

## 테스트 작성
커밋: fd3cde6

- 학생 코드 변경 없음

## T1 회원가입 폼을 register와 handleSubmit으로 바꾸기
커밋: a9da67f

| 파일 | 변경 |
|---|---|
| src/pages/JoinForm.jsx | 고침 |

```diff
// src/pages/JoinForm.jsx
@@ -1,21 +1,19 @@
-import { useState } from "react";
+import { useForm } from "react-hook-form";
 import http from "../api/http";
 import { useNavigate } from "react-router-dom";
 import FormCard from "../components/FormCard";
 import Input from "../components/Input";
 
 export default function JoinForm() {
-  const [form, setForm] = useState({ username: "", password: "", email: "" });
+  // 폼 값을 react-hook-form에 맡긴다
+  // 입력칸마다 state와 onChange를 만들지 않아도 된다
+  const { register, handleSubmit } = useForm();
   const navigate = useNavigate();
 
-  function handleChange(e) {
-    setForm({ ...form, [e.target.name]: e.target.value });
-  }
-
-  async function handleSubmit(e) {
-    e.preventDefault();
+  // data는 handleSubmit이 모아 준 폼 값이다. { username, password, email }
+  async function onSubmit(data) {
     try {
-      await http.post("/join", form);
+      await http.post("/join", data);
       alert("회원가입 완료");
       navigate("/login-form");
     } catch {
@@ -24,27 +22,14 @@ export default function JoinForm() {
     }
   }
 
+  // handleSubmit은 새로고침을 막고 폼 값을 모아 onSubmit에 넘긴다
   return (
-    <FormCard title="회원가입" onSubmit={handleSubmit}>
-      <Input
-        name="username"
-        placeholder="아이디"
-        value={form.username}
-        onChange={handleChange}
-      />
-      <Input
-        name="password"
-        type="password"
-        placeholder="비밀번호"
-        value={form.password}
-        onChange={handleChange}
-      />
-      <Input
-        name="email"
-        placeholder="이메일"
-        value={form.email}
-        onChange={handleChange}
-      />
+    <FormCard title="회원가입" onSubmit={handleSubmit(onSubmit)}>
+      {/* register("이름")은 name, onChange, onBlur, ref를 돌려준다. 펼쳐서 입력칸에 붙인다 */}
+      {/* Input은 받은 props를 input에 펼치므로 ref도 input까지 간다 */}
+      <Input placeholder="아이디" {...register("username")} />
+      <Input type="password" placeholder="비밀번호" {...register("password")} />
+      <Input placeholder="이메일" {...register("email")} />
       <button className="btn">가입하기</button>
     </FormCard>
   );
```

## T2 로그인 폼을 register와 handleSubmit으로 바꾸기
커밋: 8172bcc

| 파일 | 변경 |
|---|---|
| src/pages/LoginForm.jsx | 고침 |

```diff
// src/pages/LoginForm.jsx
@@ -1,4 +1,4 @@
-import { useState } from "react";
+import { useForm } from "react-hook-form";
 import http from "../api/http";
 import { useNavigate } from "react-router-dom";
 import FormCard from "../components/FormCard";
@@ -6,20 +6,16 @@ import Input from "../components/Input";
 import { useAuthStore } from "../store/authStore";
 
 export default function LoginForm() {
-  const [form, setForm] = useState({ username: "", password: "" });
+  const { register, handleSubmit } = useForm();
   const login = useAuthStore((state) => state.login);
   const navigate = useNavigate();
 
-  function handleChange(e) {
-    setForm({ ...form, [e.target.name]: e.target.value });
-  }
-
-  async function handleSubmit(e) {
-    e.preventDefault();
+  // data는 { username, password }다
+  async function onSubmit(data) {
     try {
-      const res = await http.post("/login", form);
+      const res = await http.post("/login", data);
       const jwt = res.headers.authorization;
-      login(jwt, form.username);
+      login(jwt, data.username);
       navigate("/");
     } catch {
       // 실패 알림은 인터셉터가 토스트로 띄웠다. 여기서는 이동만 막는다
@@ -27,20 +23,9 @@ export default function LoginForm() {
   }
 
   return (
-    <FormCard title="로그인" onSubmit={handleSubmit}>
-      <Input
-        name="username"
-        placeholder="아이디"
-        value={form.username}
-        onChange={handleChange}
-      />
-      <Input
-        name="password"
-        type="password"
-        placeholder="비밀번호"
-        value={form.password}
-        onChange={handleChange}
-      />
+    <FormCard title="로그인" onSubmit={handleSubmit(onSubmit)}>
+      <Input placeholder="아이디" {...register("username")} />
+      <Input type="password" placeholder="비밀번호" {...register("password")} />
       <button className="btn">로그인</button>
     </FormCard>
   );
```

## T3 글쓰기 폼을 바꾸고 data를 mutate로 넘기기
커밋: 8f2f34c

| 파일 | 변경 |
|---|---|
| src/pages/SaveForm.jsx | 고침 |

```diff
// src/pages/SaveForm.jsx
@@ -1,4 +1,4 @@
-import { useState } from "react";
+import { useForm } from "react-hook-form";
 import { useNavigate } from "react-router-dom";
 import { useMutation, useQueryClient } from "@tanstack/react-query";
 import http from "../api/http";
@@ -6,14 +6,15 @@ import FormCard from "../components/FormCard";
 import Input from "../components/Input";
 
 export default function SaveForm() {
-  const [form, setForm] = useState({ title: "", content: "" });
+  const { register, handleSubmit } = useForm();
   const navigate = useNavigate();
   const queryClient = useQueryClient();
 
   // 서버 데이터를 바꾸는 요청(쓰기)을 맡긴다
   // mutate()를 부르면 mutationFn을 실행하고, 성공하면 onSuccess를 실행한다
+  // mutate(data)로 넘긴 폼 값이 mutationFn의 data로 들어온다
   const saveBoard = useMutation({
-    mutationFn: () => http.post("/api/boards", form),
+    mutationFn: (data) => http.post("/api/boards", data),
     onSuccess: async () => {
       // 목록 키를 무효화한다
       // 목록을 쓰는 화면이 지금 없어서 이 키는 inactive다. 화면에 떠 있는 useQuery가 쓰는 키가 active다
@@ -27,29 +28,18 @@ export default function SaveForm() {
     },
   });
 
-  function handleChange(e) {
-    setForm({ ...form, [e.target.name]: e.target.value });
-  }
-
-  function handleSubmit(e) {
-    e.preventDefault();
-    saveBoard.mutate();
+  // data는 { title, content }다
+  function onSubmit(data) {
+    saveBoard.mutate(data);
   }
 
   return (
-    <FormCard title="글쓰기" onSubmit={handleSubmit}>
-      <Input
-        name="title"
-        placeholder="제목"
-        value={form.title}
-        onChange={handleChange}
-      />
+    <FormCard title="글쓰기" onSubmit={handleSubmit(onSubmit)}>
+      <Input placeholder="제목" {...register("title")} />
       <textarea
         className="textarea"
-        name="content"
         placeholder="내용"
-        value={form.content}
-        onChange={handleChange}
+        {...register("content")}
       />
       <button className="btn">글쓰기</button>
     </FormCard>
```

## T4 글 수정 폼을 reset으로 채우기
커밋: 89ac93f

| 파일 | 변경 |
|---|---|
| src/pages/UpdateForm.jsx | 고침 |

```diff
// src/pages/UpdateForm.jsx
@@ -1,4 +1,5 @@
-import { useEffect, useState } from "react";
+import { useEffect } from "react";
+import { useForm } from "react-hook-form";
 import { useNavigate, useParams } from "react-router-dom";
 import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
 import http from "../api/http";
@@ -8,7 +9,7 @@ import Loading from "../components/Loading";
 
 export default function UpdateForm() {
   const { id } = useParams();
-  const [form, setForm] = useState({ title: "", content: "" });
+  const { register, handleSubmit, reset } = useForm();
   const navigate = useNavigate();
   const queryClient = useQueryClient();
 
@@ -24,14 +25,15 @@ export default function UpdateForm() {
   });
 
   // board가 캐시에서 오면 그 값으로 폼을 채운다
+  // reset(값)은 폼 값을 통째로 바꾸고 입력칸에도 넣는다
   useEffect(() => {
     if (board) {
-      setForm({ title: board.title, content: board.content });
+      reset({ title: board.title, content: board.content });
     }
-  }, [board]);
+  }, [board, reset]);
 
   const updateBoard = useMutation({
-    mutationFn: () => http.put(`/api/boards/${id}`, form),
+    mutationFn: (data) => http.put(`/api/boards/${id}`, data),
     onSuccess: async () => {
       // 목록 키를 무효화한다
       // 목록을 쓰는 화면이 없어 inactive라 "all"로 지금 받게 한다
@@ -51,13 +53,8 @@ export default function UpdateForm() {
     },
   });
 
-  function handleChange(e) {
-    setForm({ ...form, [e.target.name]: e.target.value });
-  }
-
-  function handleSubmit(e) {
-    e.preventDefault();
-    updateBoard.mutate();
+  function onSubmit(data) {
+    updateBoard.mutate(data);
   }
 
   if (isPending) {
@@ -65,19 +62,12 @@ export default function UpdateForm() {
   }
 
   return (
-    <FormCard title="글 수정" onSubmit={handleSubmit}>
-      <Input
-        name="title"
-        placeholder="제목"
-        value={form.title}
-        onChange={handleChange}
-      />
+    <FormCard title="글 수정" onSubmit={handleSubmit(onSubmit)}>
+      <Input placeholder="제목" {...register("title")} />
       <textarea
         className="textarea"
-        name="content"
         placeholder="내용"
-        value={form.content}
-        onChange={handleChange}
+        {...register("content")}
       />
       <button className="btn">수정하기</button>
     </FormCard>
```

## T5 댓글 폼을 바꾸고 등록 뒤 reset으로 비우기
커밋: b6389ff

| 파일 | 변경 |
|---|---|
| src/pages/Detail.jsx | 고침 |

```diff
// src/pages/Detail.jsx
@@ -1,4 +1,4 @@
-import { useState } from "react";
+import { useForm } from "react-hook-form";
 import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
 import http from "../api/http";
 import { Link, useNavigate, useParams } from "react-router-dom";
@@ -8,7 +8,7 @@ import Notice from "../components/Notice";
 
 export default function Detail() {
   const { id } = useParams();
-  const [comment, setComment] = useState("");
+  const { register, handleSubmit, reset } = useForm();
   const navigate = useNavigate();
   // main.jsx에서 만든 캐시 저장소를 꺼낸다. 쓰기 뒤 캐시를 맞출 때 쓴다
   const queryClient = useQueryClient();
@@ -47,9 +47,11 @@ export default function Detail() {
 
   // 댓글 쓰기와 삭제도 useMutation에 맡긴다. 성공 뒤 할 일을 onSuccess 한 곳에 모은다
   const saveReply = useMutation({
-    mutationFn: () => http.post("/api/replies", { boardId: id, comment }),
+    mutationFn: (data) =>
+      http.post("/api/replies", { boardId: id, comment: data.comment }),
     onSuccess: () => {
-      setComment("");
+      // 값 없이 reset()을 부르면 입력칸을 처음처럼 비운다
+      reset();
       // 상세 키를 무효화한다 (invalidateQueries)
       // 무효화하면 그 키는 stale이 되어 다시 받을 대상이 된다
       // 이 화면이 위 useQuery로 상세 키를 쓰고 있어서 지금 바로 다시 받는다
@@ -70,9 +72,8 @@ export default function Detail() {
     deleteBoard.mutate();
   }
 
-  function handleReplySubmit(e) {
-    e.preventDefault();
-    saveReply.mutate();
+  function onReplySubmit(data) {
+    saveReply.mutate(data);
   }
 
   function handleReplyDelete(replyId) {
@@ -124,12 +125,11 @@ export default function Detail() {
           />
         ))}
       </ul>
-      <form className="flex gap-2 mt-4" onSubmit={handleReplySubmit}>
+      <form className="flex gap-2 mt-4" onSubmit={handleSubmit(onReplySubmit)}>
         <input
           className="input flex-1"
           placeholder="댓글을 입력하세요"
-          value={comment}
-          onChange={(e) => setComment(e.target.value)}
+          {...register("comment")}
         />
         <button className="btn">등록</button>
       </form>
```

## T6 내 정보 폼을 reset으로 채우기
커밋: e68bbca

| 파일 | 변경 |
|---|---|
| src/pages/UserInfo.jsx | 고침 |

```diff
// src/pages/UserInfo.jsx
@@ -1,4 +1,5 @@
-import { useEffect, useState } from "react";
+import { useEffect } from "react";
+import { useForm } from "react-hook-form";
 import { useNavigate } from "react-router-dom";
 import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
 import http from "../api/http";
@@ -7,7 +8,7 @@ import Input from "../components/Input";
 import Loading from "../components/Loading";
 
 export default function UserInfo() {
-  const [form, setForm] = useState({ username: "", email: "", password: "" });
+  const { register, handleSubmit, reset } = useForm();
   const navigate = useNavigate();
   const queryClient = useQueryClient();
 
@@ -22,15 +23,16 @@ export default function UserInfo() {
   });
 
   // user가 캐시에서 오면 폼을 채운다. 새 비밀번호 칸은 비워 둔다
+  // 아이디는 서버에 보내지 않는 값이라 폼에 넣지 않는다
   useEffect(() => {
     if (user) {
-      setForm({ username: user.username, email: user.email, password: "" });
+      reset({ email: user.email, password: "" });
     }
-  }, [user]);
+  }, [user, reset]);
 
   const updateUser = useMutation({
-    mutationFn: () =>
-      http.put("/api/user", { email: form.email, password: form.password }),
+    // data는 { email, password }다
+    mutationFn: (data) => http.put("/api/user", data),
     // res는 mutationFn이 돌려준 수정 응답이다
     onSuccess: (res) => {
       // 서버에 다시 묻지 않고 ["user"] 캐시를 이 값으로 바꾼다 (setQueryData)
@@ -41,13 +43,8 @@ export default function UserInfo() {
     },
   });
 
-  function handleChange(e) {
-    setForm({ ...form, [e.target.name]: e.target.value });
-  }
-
-  function handleSubmit(e) {
-    e.preventDefault();
-    updateUser.mutate();
+  function onSubmit(data) {
+    updateUser.mutate(data);
   }
 
   if (isPending) {
@@ -55,20 +52,13 @@ export default function UserInfo() {
   }
 
   return (
-    <FormCard title="내 정보" onSubmit={handleSubmit}>
-      <Input value={form.username} readOnly />
-      <Input
-        name="email"
-        placeholder="이메일"
-        value={form.email}
-        onChange={handleChange}
-      />
+    <FormCard title="내 정보" onSubmit={handleSubmit(onSubmit)}>
+      <Input value={user.username} readOnly />
+      <Input placeholder="이메일" {...register("email")} />
       <Input
-        name="password"
         type="password"
         placeholder="새 비밀번호"
-        value={form.password}
-        onChange={handleChange}
+        {...register("password")}
       />
       <button className="btn">수정하기</button>
     </FormCard>
```

## T7 회원가입 비밀번호에 4자 규칙과 문구 두기
커밋: 74d14c5

| 파일 | 변경 |
|---|---|
| src/pages/JoinForm.jsx | 고침 |

```diff
// src/pages/JoinForm.jsx
@@ -7,7 +7,12 @@ import Input from "../components/Input";
 export default function JoinForm() {
   // 폼 값을 react-hook-form에 맡긴다
   // 입력칸마다 state와 onChange를 만들지 않아도 된다
-  const { register, handleSubmit } = useForm();
+  // errors에는 검사 규칙에 걸린 칸의 문구가 들어간다
+  const {
+    register,
+    handleSubmit,
+    formState: { errors },
+  } = useForm();
   const navigate = useNavigate();
 
   // data는 handleSubmit이 모아 준 폼 값이다. { username, password, email }
@@ -23,12 +28,23 @@ export default function JoinForm() {
   }
 
   // handleSubmit은 새로고침을 막고 폼 값을 모아 onSubmit에 넘긴다
+  // 검사 규칙에 걸리면 onSubmit을 부르지 않고 그 칸으로 커서를 옮긴다
   return (
     <FormCard title="회원가입" onSubmit={handleSubmit(onSubmit)}>
       {/* register("이름")은 name, onChange, onBlur, ref를 돌려준다. 펼쳐서 입력칸에 붙인다 */}
       {/* Input은 받은 props를 input에 펼치므로 ref도 input까지 간다 */}
       <Input placeholder="아이디" {...register("username")} />
-      <Input type="password" placeholder="비밀번호" {...register("password")} />
+      {/* register의 두 번째 인자로 검사 규칙을 준다. minLength는 빈 값은 검사하지 않는다 */}
+      <Input
+        type="password"
+        placeholder="비밀번호"
+        {...register("password", {
+          minLength: { value: 4, message: "비밀번호는 4자 이상이어야 합니다" },
+        })}
+      />
+      {errors.password && (
+        <p className="text-error text-sm">{errors.password.message}</p>
+      )}
       <Input placeholder="이메일" {...register("email")} />
       <button className="btn">가입하기</button>
     </FormCard>
```

## T8 칠 때마다 검사하기
커밋: 8200900

| 파일 | 변경 |
|---|---|
| src/pages/JoinForm.jsx | 고침 |

```diff
// src/pages/JoinForm.jsx
@@ -8,11 +8,12 @@ export default function JoinForm() {
   // 폼 값을 react-hook-form에 맡긴다
   // 입력칸마다 state와 onChange를 만들지 않아도 된다
   // errors에는 검사 규칙에 걸린 칸의 문구가 들어간다
+  // mode "onChange"는 가입하기를 누르기 전에도 칠 때마다 검사한다
   const {
     register,
     handleSubmit,
     formState: { errors },
-  } = useForm();
+  } = useForm({ mode: "onChange" });
   const navigate = useNavigate();
 
   // data는 handleSubmit이 모아 준 폼 값이다. { username, password, email }
```

## T9 내 정보 아이디도 폼에 두기
커밋: 95e3a35

| 파일 | 변경 |
|---|---|
| src/pages/UserInfo.jsx | 고침 |

```diff
// src/pages/UserInfo.jsx
@@ -23,16 +23,16 @@ export default function UserInfo() {
   });
 
   // user가 캐시에서 오면 폼을 채운다. 새 비밀번호 칸은 비워 둔다
-  // 아이디는 서버에 보내지 않는 값이라 폼에 넣지 않는다
   useEffect(() => {
     if (user) {
-      reset({ email: user.email, password: "" });
+      reset({ username: user.username, email: user.email, password: "" });
     }
   }, [user, reset]);
 
   const updateUser = useMutation({
-    // data는 { email, password }다
-    mutationFn: (data) => http.put("/api/user", data),
+    // data는 { username, email, password }다. 아이디는 바꿀 수 없어 보내지 않는다
+    mutationFn: (data) =>
+      http.put("/api/user", { email: data.email, password: data.password }),
     // res는 mutationFn이 돌려준 수정 응답이다
     onSuccess: (res) => {
       // 서버에 다시 묻지 않고 ["user"] 캐시를 이 값으로 바꾼다 (setQueryData)
@@ -53,7 +53,7 @@ export default function UserInfo() {
 
   return (
     <FormCard title="내 정보" onSubmit={handleSubmit(onSubmit)}>
-      <Input value={user.username} readOnly />
+      <Input readOnly {...register("username")} />
       <Input placeholder="이메일" {...register("email")} />
       <Input
         type="password"
```
