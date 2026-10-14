# 시나리오별 구조도

## 앱 띄우기와 메뉴 이동

```mermaid
flowchart LR
  A[index.html] --> B[main.jsx]
  B --> C["라우트 (Route)"]
  C --> D[Layout]
  D --> E[Header 메뉴]
  D --> F[Outlet 자리]
  E --> G[SaveForm]
  E --> H[LoginForm]
  E --> I[JoinForm]
  E --> J[UserInfo]
  F --> K[Home]
```

만든 장: project-setup, layout, screens
맡는 파일
- react-blog/index.html
- react-blog/src/main.jsx
- react-blog/src/App.jsx
- react-blog/src/components/Layout.jsx
- react-blog/src/components/Header.jsx
- react-blog/src/pages/Home.jsx
- react-blog/src/pages/SaveForm.jsx
- react-blog/src/pages/LoginForm.jsx
- react-blog/src/pages/JoinForm.jsx
- react-blog/src/pages/UserInfo.jsx
- react-blog/src/index.css

## 글 목록 보기

```mermaid
flowchart LR
  A[Home] --> B["GET /?page=0"]
  B --> C[routes/boards.js]
  C --> D[(boards)]
  A --> E[BoardCard]
```

만든 장: screens, component-split, board-list, board-save
맡는 파일
- react-blog/src/pages/Home.jsx
- react-blog/src/components/BoardCard.jsx
- react-blog/src/api/http.jsx
- server-node/src/routes/boards.js
- server-node/src/db.js

## 글 상세 보기

```mermaid
flowchart LR
  A[Detail] --> B["GET /api/boards/:id"]
  B --> C[routes/boards.js]
  C --> D[(boards)]
  C --> E[(replies)]
  A --> F[ReplyItem]
```

만든 장: screens, component-split, board-detail, board-save
맡는 파일
- react-blog/src/pages/Detail.jsx
- react-blog/src/components/ReplyItem.jsx
- react-blog/src/api/http.jsx
- server-node/src/routes/boards.js
- server-node/src/db.js

## 글 보기에서 수정 화면까지

```mermaid
flowchart LR
  A[Home] --> B[BoardCard]
  B --> C[Detail]
  C --> D[ReplyItem]
  C --> E[UpdateForm]
  E --> F[BoardForm]
```

만든 장: screens, component-split, board-list, board-detail
맡는 파일
- react-blog/src/pages/Home.jsx
- react-blog/src/components/BoardCard.jsx
- react-blog/src/pages/Detail.jsx
- react-blog/src/components/ReplyItem.jsx
- react-blog/src/pages/UpdateForm.jsx
- react-blog/src/components/BoardForm.jsx
- react-blog/src/App.jsx

## 회원가입

```mermaid
flowchart LR
  A[JoinForm] --> B["POST /join"]
  B --> C[routes/users.js]
  C --> D[(users)]
  A --> E[LoginForm]
```

만든 장: screens, component-split, join, board-save
맡는 파일
- react-blog/src/pages/JoinForm.jsx
- react-blog/src/components/FormCard.jsx
- react-blog/src/components/Input.jsx
- react-blog/src/api/http.jsx
- server-node/src/routes/users.js
- server-node/src/db.js

## 로그인과 로그아웃

```mermaid
flowchart LR
  A[LoginForm] --> B["POST /login"]
  B --> C[routes/users.js]
  C --> D[(users)]
  A --> E[useAuthStore]
  E --> F[Header]
  F --> E
  E --> G[(localStorage)]
```

만든 장: screens, component-split, login, login-keep, board-save
맡는 파일
- react-blog/src/pages/LoginForm.jsx
- react-blog/src/store/authStore.jsx
- react-blog/src/components/Header.jsx
- react-blog/src/components/FormCard.jsx
- react-blog/src/components/Input.jsx
- react-blog/src/api/http.jsx
- server-node/src/routes/users.js
- server-node/src/auth.js

## 글쓰기

```mermaid
flowchart LR
  A[SaveForm] --> B[BoardForm]
  A --> C[http]
  C --> D["POST /api/boards"]
  D --> E[routes/boards.js]
  E --> F[(boards)]
  A --> G[Home]
```

만든 장: screens, component-split, board-save
맡는 파일
- react-blog/src/pages/SaveForm.jsx
- react-blog/src/components/BoardForm.jsx
- react-blog/src/api/http.jsx
- server-node/src/routes/boards.js
- server-node/src/auth.js

## 폼 화면 조각

```mermaid
flowchart LR
  A[SaveForm] --> C[BoardForm]
  B[UpdateForm] --> C
  C --> D[FormCard]
  C --> E[Input]
  F["Login, Join, UserInfo"] --> D
  F --> E
```

만든 장: screens, component-split
맡는 파일
- react-blog/src/components/FormCard.jsx
- react-blog/src/components/Input.jsx
- react-blog/src/components/BoardForm.jsx
- react-blog/src/pages/SaveForm.jsx
- react-blog/src/pages/UpdateForm.jsx
- react-blog/src/pages/LoginForm.jsx
- react-blog/src/pages/JoinForm.jsx
- react-blog/src/pages/UserInfo.jsx

홈 목록과 상세는 서버에서 받는다.
회원가입은 서버에 저장한다.
로그인은 토큰을 받아 스토어에 기억하고 헤더가 그것을 본다.
토큰은 localStorage에도 남아 새로고침해도 로그인이 유지된다. 로그아웃하면 지운다.
서버 요청은 모두 http를 지나고, 로그인했으면 토큰이 붙는다.
글쓰기는 토큰과 함께 보내고 홈으로 간다.
글 수정, 내 정보 폼은 아직 보내지 않는다.
