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

만든 장: project-setup, layout, screens, react-query
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
  A[Home] --> B["GET /?page=&keyword="]
  B --> C[routes/boards.js]
  C --> D[(boards)]
  A --> E[BoardCard]
  A --> F[Loading]
```

만든 장: screens, component-split, board-list, board-save, react-query, error-handling, paging-search
맡는 파일
- react-blog/src/pages/Home.jsx
- react-blog/src/components/BoardCard.jsx
- react-blog/src/components/Loading.jsx
- react-blog/src/api/http.jsx
- server-node/src/routes/boards.js
- server-node/src/db.js

목록 키는 ["boards", "list", { page, keyword }]다. 페이지와 검색어마다 캐시 칸이 따로 생긴다.
이전, 다음 버튼은 서버가 준 isFirst, isLast로 막고 가운데에 쪽 번호를 보인다.
검색창에 칠 때마다 제목으로 찾고 첫 페이지부터 본다.
새 키를 받는 동안 placeholderData로 이전 목록과 검색창을 그대로 보인다. 처음 들어올 때만 Loading을 보인다.
결과가 없으면 목록 자리에 검색 결과가 없습니다를 보인다.
글을 쓰거나 고치거나 지우면 ["boards", "list"] 무효화가 모든 페이지와 검색 키에 걸린다.

## 글 상세 보기

```mermaid
flowchart LR
  A[Detail] --> B["GET /api/boards/:id"]
  B --> C[routes/boards.js]
  C --> D[(boards)]
  C --> E[(replies)]
  A --> F[ReplyItem]
```

만든 장: screens, component-split, board-detail, board-save, react-query, error-handling
맡는 파일
- react-blog/src/pages/Detail.jsx
- react-blog/src/components/ReplyItem.jsx
- react-blog/src/api/http.jsx
- server-node/src/routes/boards.js
- server-node/src/db.js

## 글 수정

```mermaid
flowchart LR
  A[Detail] --> B[UpdateForm]
  B --> C[http]
  C --> D["GET /api/boards/:id"]
  C --> E["PUT /api/boards/:id"]
  D --> F[routes/boards.js]
  E --> F
  F --> G[(boards)]
  B --> A
```

만든 장: screens, component-split, board-detail, board-update-delete, react-query, error-handling, form-hook
맡는 파일
- react-blog/src/pages/Detail.jsx
- react-blog/src/pages/UpdateForm.jsx
- react-blog/src/components/FormCard.jsx
- react-blog/src/components/Input.jsx
- react-blog/src/api/http.jsx
- react-blog/src/App.jsx
- server-node/src/routes/boards.js
- server-node/src/auth.js

## 글 삭제

```mermaid
flowchart LR
  A[Detail] --> B[http]
  B --> C["DELETE /api/boards/:id"]
  C --> D[routes/boards.js]
  D --> E[(boards)]
  D --> F[(replies)]
  A --> G[Home]
```

만든 장: screens, board-detail, board-update-delete, react-query
맡는 파일
- react-blog/src/pages/Detail.jsx
- react-blog/src/api/http.jsx
- server-node/src/routes/boards.js
- server-node/src/auth.js

## 댓글 쓰기

```mermaid
flowchart LR
  A[Detail] --> B[http]
  B --> C["POST /api/replies"]
  C --> D[routes/replies.js]
  D --> E[(replies)]
  B --> F["GET /api/boards/:id"]
  F --> G[routes/boards.js]
  G --> E
```

만든 장: screens, board-detail, board-save, reply, react-query, form-hook
맡는 파일
- react-blog/src/pages/Detail.jsx
- react-blog/src/api/http.jsx
- server-node/src/routes/replies.js
- server-node/src/routes/boards.js
- server-node/src/auth.js

## 댓글 삭제

```mermaid
flowchart LR
  A[ReplyItem] --> B[Detail]
  B --> C[http]
  C --> D["DELETE /api/replies/:id"]
  D --> E[routes/replies.js]
  E --> F[(replies)]
  C --> G["GET /api/boards/:id"]
  G --> H[routes/boards.js]
  H --> F
```

만든 장: screens, component-split, board-detail, board-save, reply, react-query
맡는 파일
- react-blog/src/components/ReplyItem.jsx
- react-blog/src/pages/Detail.jsx
- react-blog/src/api/http.jsx
- server-node/src/routes/replies.js
- server-node/src/routes/boards.js
- server-node/src/auth.js

## 회원가입

```mermaid
flowchart LR
  A[JoinForm] --> B["register (minLength)"]
  B --> C["POST /join"]
  C --> D[routes/users.js]
  D --> E[(users)]
  A --> F[LoginForm]
```

만든 장: screens, component-split, join, board-save, error-handling, form-hook
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

만든 장: screens, component-split, login, login-keep, board-save, react-query, error-handling, form-hook
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
  A[SaveForm] --> B[FormCard]
  A --> C[http]
  C --> D["POST /api/boards"]
  D --> E[routes/boards.js]
  E --> F[(boards)]
  A --> G[Home]
```

만든 장: screens, component-split, board-save, react-query, form-hook
맡는 파일
- react-blog/src/pages/SaveForm.jsx
- react-blog/src/components/FormCard.jsx
- react-blog/src/components/Input.jsx
- react-blog/src/api/http.jsx
- server-node/src/routes/boards.js
- server-node/src/auth.js

## 내 정보 수정

```mermaid
flowchart LR
  A[UserInfo] --> B[http]
  B --> C["GET /api/user"]
  B --> D["PUT /api/user"]
  C --> E[routes/users.js]
  D --> E
  E --> F[(users)]
  A --> G[Home]
```

만든 장: screens, component-split, board-save, my-info, react-query, error-handling, form-hook
맡는 파일
- react-blog/src/pages/UserInfo.jsx
- react-blog/src/components/FormCard.jsx
- react-blog/src/components/Input.jsx
- react-blog/src/api/http.jsx
- server-node/src/routes/users.js
- server-node/src/auth.js

## 폼 화면 조각

```mermaid
flowchart LR
  A["Save, Update"] --> D[FormCard]
  A --> E[Input]
  F["Login, Join, UserInfo"] --> D
  F --> E
```

만든 장: screens, component-split
맡는 파일
- react-blog/src/components/FormCard.jsx
- react-blog/src/components/Input.jsx
- react-blog/src/pages/SaveForm.jsx
- react-blog/src/pages/UpdateForm.jsx
- react-blog/src/pages/LoginForm.jsx
- react-blog/src/pages/JoinForm.jsx
- react-blog/src/pages/UserInfo.jsx

홈 목록과 상세는 서버에서 받는다.
회원가입은 비밀번호가 4자 이상이면 서버에 저장한다.
로그인은 토큰을 받아 스토어에 기억하고 헤더가 그것을 본다.
토큰은 localStorage에도 남아 새로고침해도 로그인이 유지된다. 로그아웃하면 지운다.
서버 요청은 모두 http를 지나고 로그인했으면 토큰이 붙는다.
글쓰기는 토큰과 함께 보내고 홈으로 간다.
상세는 owner가 true인 내 글에만 수정, 삭제 버튼을 보인다.
글 수정은 기존 값을 채운 폼으로 PUT을 보내고 상세로 간다. 글 삭제는 DELETE를 보내고 홈으로 간다.
댓글은 등록하거나 owner인 댓글의 휴지통을 누르면 서버에 보내고 상세를 다시 받는다.
내 정보는 받은 아이디와 이메일로 폼을 채우고 수정하기를 누르면 PUT을 보내고 홈으로 간다.

## 폼 값 다루기

```mermaid
flowchart LR
  A["Join, Login, Save"] --> B[useForm]
  C["Update, UserInfo, Detail"] --> B
  B --> D[register]
  B --> E[handleSubmit]
  B --> F[reset]
  D --> G[Input]
  E --> H[onSubmit]
  H --> I[http]
```

만든 장: form-hook
맡는 파일
- react-blog/src/pages/JoinForm.jsx
- react-blog/src/pages/LoginForm.jsx
- react-blog/src/pages/SaveForm.jsx
- react-blog/src/pages/UpdateForm.jsx
- react-blog/src/pages/UserInfo.jsx
- react-blog/src/pages/Detail.jsx
- react-blog/src/components/Input.jsx

폼 값은 react-hook-form이 맡는다. 입력칸은 register로 붙고 Input이 받은 속성을 input에 펼친다.
handleSubmit이 폼 값 data를 모아 onSubmit에 넘기고, onSubmit이 http나 mutate로 보낸다.
글 수정과 내 정보는 서버 값이 오면 reset(값)으로 채운다. 댓글은 등록 뒤 reset()으로 비운다.
회원가입 비밀번호는 칠 때마다 4자 규칙을 검사한다. 걸리면 칸 아래 문구를 보이고 요청 없이 그 칸으로 커서가 간다.
빈 비밀번호는 이 규칙이 검사하지 않고 서버가 막아 토스트가 뜬다.

## 캐시로 그리기와 다시 받기

```mermaid
flowchart LR
  A[main.jsx] --> B[QueryClient]
  C[Home] --> B
  D[Detail] --> B
  E[UpdateForm] --> B
  F[UserInfo] --> B
  G[SaveForm] --> B
  H[Header] --> B
  B --> I[http]
  I --> J["GET /?page=&keyword="]
  I --> K["GET /api/boards/:id"]
  I --> L["GET /api/user"]
```

만든 장: react-query, paging-search
맡는 파일
- react-blog/src/main.jsx
- react-blog/src/pages/Home.jsx
- react-blog/src/pages/Detail.jsx
- react-blog/src/pages/UpdateForm.jsx
- react-blog/src/pages/UserInfo.jsx
- react-blog/src/pages/SaveForm.jsx
- react-blog/src/components/Header.jsx
- react-blog/src/api/http.jsx

## 실패 알리기

```mermaid
flowchart LR
  A["Home, Detail, UpdateForm, UserInfo"] --> B[Loading]
  C[Detail] --> D[Notice]
  E[NotFound] --> D
  F[App.jsx] --> E
  G[http] --> H[Toaster]
  I[main.jsx] --> H
  I --> J[QueryClient]
  K["JoinForm, LoginForm"] --> G
```

만든 장: error-handling
맡는 파일
- react-blog/src/components/Loading.jsx
- react-blog/src/components/Notice.jsx
- react-blog/src/pages/NotFound.jsx
- react-blog/src/pages/Detail.jsx
- react-blog/src/App.jsx
- react-blog/src/api/http.jsx
- react-blog/src/main.jsx
- react-blog/src/pages/JoinForm.jsx
- react-blog/src/pages/LoginForm.jsx

조회는 받는 동안 Loading을 보이고, 없는 글이면 Detail이 Notice로 안내한다.
조회 실패는 400대면 다시 묻지 않고, 500과 연결 실패는 한 번만 다시 묻는다.
쓰기 실패는 http 응답 인터셉터가 서버 msg를 토스트로 띄우고 그 화면에 남는다.
응답이 없으면 조회든 쓰기든 서버에 연결할 수 없다는 토스트를 하나만 띄운다.
없는 주소는 path="*" 라우트가 NotFound로 받는다.
