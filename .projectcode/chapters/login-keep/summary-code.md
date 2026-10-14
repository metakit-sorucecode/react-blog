# login-keep 코드 요약

## 테스트 작성
커밋: a759ce1
- 학생 코드 변경 없음

## T1 로그인하면 토큰을 브라우저에 저장하기
커밋: aab0c41

| 파일 | 변경 |
|---|---|
| src/store/authStore.jsx | 고침 |

```diff
// src/store/authStore.jsx
@@ -4,6 +4,9 @@ export const useAuthStore = create((set) => ({
   isLogin: false,
   jwt: "",
   username: "",
-  login: (jwt, username) => set({ isLogin: true, jwt, username }),
+  login: (jwt, username) => {
+    localStorage.setItem("jwt", jwt);
+    set({ isLogin: true, jwt, username });
+  },
   logout: () => set({ isLogin: false, jwt: "", username: "" }),
 }));
```

## T2 앱이 시작할 때 저장된 토큰으로 로그인 되살리기
커밋: b2924ff

| 파일 | 변경 |
|---|---|
| src/store/authStore.jsx | 고침 |

```diff
// src/store/authStore.jsx
@@ -1,9 +1,12 @@
 import { create } from "zustand";
+import { jwtDecode } from "jwt-decode";
+
+const savedJwt = localStorage.getItem("jwt");
 
 export const useAuthStore = create((set) => ({
-  isLogin: false,
-  jwt: "",
-  username: "",
+  isLogin: savedJwt ? true : false,
+  jwt: savedJwt ? savedJwt : "",
+  username: savedJwt ? jwtDecode(savedJwt.replace("Bearer ", "")).username : "",
   login: (jwt, username) => {
     localStorage.setItem("jwt", jwt);
     set({ isLogin: true, jwt, username });
```

## T3 로그아웃하면 저장한 토큰 지우기
커밋: 3508e00

| 파일 | 변경 |
|---|---|
| src/store/authStore.jsx | 고침 |

```diff
// src/store/authStore.jsx
@@ -11,5 +11,8 @@ export const useAuthStore = create((set) => ({
     localStorage.setItem("jwt", jwt);
     set({ isLogin: true, jwt, username });
   },
-  logout: () => set({ isLogin: false, jwt: "", username: "" }),
+  logout: () => {
+    localStorage.removeItem("jwt");
+    set({ isLogin: false, jwt: "", username: "" });
+  },
 }));
```

## 테스트 보강
커밋: 8c25f83
- 학생 코드 변경 없음
