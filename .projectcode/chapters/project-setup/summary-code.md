# project-setup 코드 요약

## T1 start를 react-blog로 복사하기
커밋: c4216cb

| 파일 | 변경 |
|---|---|
| react-blog/ | 새로. react-blog-modern-start 복사본 27개 파일 |

- dist, GUIDE.md, README.md는 복사하지 않았다
- node_modules는 복사했지만 커밋하지 않는다
- 직접 쓴 코드는 없다

## T2 옛 코드를 지우고 Hello World 띄우기
커밋: 75b6a84

| 파일 | 변경 |
|---|---|
| src/App.jsx | 새로 |
| src/main.jsx | 고침 |
| vite.config.js | 고침 |
| src/app, features, shared, test | 지움. 20개 파일 |

```jsx
// src/App.jsx
export default function App() {
  return <h1 className="text-3xl font-bold">Hello World</h1>;
}
```

```diff
// src/main.jsx
-import React from "react";
-import ReactDOM from "react-dom/client";
-import { RouterProvider } from "react-router-dom";
+import { StrictMode } from "react";
+import { createRoot } from "react-dom/client";
 import "./index.css";
-import { router } from "./app/router";
-import { DummyProvider } from "./shared/dummy/DummyProvider";
+import App from "./App";

-ReactDOM.createRoot(document.getElementById("root")).render(
-  <React.StrictMode>
-    <DummyProvider>
-      <RouterProvider router={router} />
-    </DummyProvider>
-  </React.StrictMode>
+createRoot(document.getElementById("root")).render(
+  <StrictMode>
+    <App />
+  </StrictMode>,
 );
```

```diff
// vite.config.js
 export default defineConfig({
   plugins: [react(), tailwindcss()],
   server: { port: 5173 },
-  test: {
-    environment: "jsdom",
-    globals: true,
-    setupFiles: "./src/test/setup.js",
-  },
 });
```

## T3 포맷 명령 더하기
커밋: 471bf5f

| 파일 | 변경 |
|---|---|
| package.json | 고침. scripts에 한 줄 |

```diff
// package.json
-    "test": "vitest run"
+    "test": "vitest run",
+    "format": "prettier --write src"
```

## T4 서버와 프론트를 함께 띄우는 테스트 실행기
커밋: fac2b80
- 학생 코드 변경 없음. 루트의 테스트 실행기만 더했다

## 테스트 보강
커밋: ec79b62
- 학생 코드 변경 없음
