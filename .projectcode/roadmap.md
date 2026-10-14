# 로드맵

강의: server-node와 통신하는 React 블로그 라이브코딩
대상: React 기초, 라우팅, zustand를 배운 학생
결과물: 회원가입, 로그인, 글과 댓글 쓰기가 되는 블로그

## 선수 지식
- React: 컴포넌트, JSX, props, useState, useEffect
- react-router: 라우트, Link, useNavigate
- zustand: 스토어 만들고 꺼내 쓰기
- JS: async/await, 구조 분해, 배열 메서드

## 학습 목표
- 화면을 먼저 그리고 겹치는 부분을 컴포넌트로 나누기
- axios로 서버와 통신하기
- JWT 토큰으로 로그인 상태 다루기
- TanStack Query로 서버 데이터 관리하기
- react-hook-form으로 폼 다루기
- 에러를 화면에 알리기

## 장
| 번호 | 장 ID | 이름 | 종류 | 배울 것 | 상태 |
|---|---|---|---|---|---|
| 1 | project-setup | 출발점 (강의 전 준비) | 기능 | 실행 방법, 폴더 구조 | 완료 |
| 2 | layout | 레이아웃과 헤더 | 기능 | Layout과 Outlet, 헤더 메뉴, NavLink로 지금 메뉴 강조, Tailwind와 DaisyUI 최소 스타일 | 완료 |
| 3 | screens | 화면 그리기와 라우트 | 기능 | 화면 7개 정적 마크업, 라우트 연결, grid 글 목록 | 완료 |
| 4 | component-split | 겹치는 화면을 컴포넌트로 | 리팩터 | 컴포넌트 분리, props, children, props 펼침, map | 완료 |
| 5 | board-list | 글 목록 | 기능 | axios GET, useEffect로 서버 데이터 그리기 | 완료 |
| 6 | board-detail | 글 상세 | 기능 | useParams, 상세와 댓글 목록 그리기 | 완료 |
| 7 | join | 회원가입 | 기능 | useState 폼, axios POST, 성공하면 이동 | 완료 |
| 8 | login | 로그인 | 기능 | 응답 헤더 토큰, zustand 로그인 상태, 헤더 메뉴 바꾸기, 로그아웃 | 완료 |
| 9 | login-keep | 로그인 유지 | 기능 | localStorage, jwt-decode로 복원 | 완료 |
| 10 | board-save | 글쓰기 | 기능 | axios 인스턴스와 인터셉터로 토큰 보내기 | 완료 |
| 11 | board-update-delete | 글 수정과 삭제 | 기능 | owner로 버튼 보이기, 기존 값 채운 폼, PUT과 DELETE | 완료 |
| 12 | reply | 댓글 쓰기와 삭제 | 기능 | 요청 뒤 상세 다시 불러오기 | 대기 |
| 13 | my-info | 내 정보 수정 | 기능 | 조회한 값으로 폼 채우기, PUT | 대기 |
| 14 | react-query | 서버 데이터를 TanStack Query로 | 리팩터 | useQuery, useMutation, 계층 queryKey, staleTime, invalidateQueries로 필요한 키만 갱신, 로그아웃 때 캐시 비우기, Devtools | 대기 |
| 15 | error-handling | 에러 처리 | 기능 | isPending 로딩, isError로 없는 글 안내, 응답 인터셉터에서 sonner 토스트, 없는 주소 안내 | 대기 |
| 16 | paging-search | 페이징과 검색 | 기능 | queryKey에 page와 keyword, 이전 화면 유지 | 대기 |
| 17 | search-debounce | 검색 디바운스 | 기능 | 커스텀 훅 useDebounce, 입력이 멈춘 뒤 요청 | 대기 |
| 18 | form-hook | 폼을 react-hook-form으로 | 리팩터 | register, handleSubmit, reset, 검사 규칙 하나와 errors 문구 | 대기 |
| 19 | auth-guard | 로그인 확인 | 기능 | 로그인 안내, 남의 글 수정 막기 | 대기 |

## 장 상세

### 1 project-setup 출발점 (강의 전 준비)
- react-blog-modern-start를 react-blog로 복사한다
- src의 app, features, shared, test 폴더를 지운다
- dist와 GUIDE.md를 지운다
- vite.config.js에서 vitest 설정을 뺀다
- index.css는 Tailwind와 DaisyUI 두 줄만 남긴다
- src에는 main.jsx와 App.jsx만 남고 App이 Hello World를 보인다
- src 파일은 모두 .jsx로 쓴다
- 루트에 Playwright 테스트 실행기를 둔다
- 학생은 이 상태를 받아 강의를 시작한다
- 끝나면 npm run dev로 Hello World가 보인다

### 2 layout 레이아웃과 헤더
- Layout에 Header와 Outlet을 두고 바깥 여백을 준다
- Header에 홈, 로그인, 회원가입, 글쓰기, 내 정보 메뉴 링크를 둔다
- 지금 보고 있는 화면의 메뉴를 강조한다
- 라우터에 Layout과 홈을 연결한다
- 홈 말고 다른 메뉴는 3장에서 화면이 생긴다
- 끝나면 흰 바탕에 검정 글자 헤더와 홈이 보인다

### 3 screens 화면 그리기와 라우트
- 화면 7개를 예시 글자로 그린다. 홈, 상세, 글쓰기, 수정, 로그인, 회원가입, 내 정보
- 홈은 글 카드 3개를 grid로 놓는다
- 상세는 제목, 내용, 작성자, 수정과 삭제 버튼, 댓글 목록, 댓글 입력을 둔다
- 폼 화면은 입력칸과 버튼을 둔다
- 컴포넌트를 미리 나누지 않는다. 겹치는 마크업을 그대로 둔다
- 화면 7개를 라우트로 연결한다
- 끝나면 헤더 메뉴와 글 카드로 모든 화면을 오간다

### 4 component-split 겹치는 화면을 컴포넌트로 (리팩터)
- 3장에서 여러 번 쓴 마크업을 찾는다. 글 카드, 댓글 줄, 폼 틀, 입력칸
- 겹치는 것을 컴포넌트로 빼고 다른 값은 props로 넘긴다
- 같은 카드를 여러 번 쓴 곳은 배열과 map으로 바꾼다
- 폼 틀은 안의 내용을 children으로 받는다
- 입력칸은 받은 속성을 펼쳐서 넘긴다
- 화면 동작은 같다

### 5 board-list 글 목록
- 홈의 예시 글 카드를 서버에서 받은 글로 바꾼다
- 제목을 누르면 상세 주소로 간다
- 받기 전에는 빈 목록이다
- API: GET /?page=0
- 끝나면 서버에 있는 글 제목 3개가 보인다

### 6 board-detail 글 상세
- 주소의 글 번호로 상세를 받는다
- 예시 글자를 받은 제목, 내용, 작성자, 댓글 목록으로 바꾼다
- API: GET /api/boards/:id
- 끝나면 목록에서 글을 누르면 상세와 댓글이 보인다

### 7 join 회원가입
- 그려 둔 회원가입 폼에 useState를 붙여 아이디, 비밀번호, 이메일을 받는다
- 가입하기를 누르면 서버에 보내고 로그인 화면으로 간다
- 실패 처리는 19장에서 한다
- API: POST /join
- 끝나면 새 아이디로 가입된다

### 8 login 로그인
- 아이디와 비밀번호를 보낸다
- 응답 헤더 Authorization에서 토큰을 꺼낸다
- zustand 스토어에 isLogin, jwt, username을 저장한다
- 헤더 메뉴가 로그인 전에는 로그인과 회원가입, 로그인 뒤에는 글쓰기, 내 정보, 로그아웃이다
- 로그아웃을 누르면 스토어를 비우고 홈으로 간다
- 새로고침하면 로그아웃된다. 9장에서 고친다
- API: POST /login
- 끝나면 ssar로 로그인하면 헤더 메뉴가 바뀐다

### 9 login-keep 로그인 유지
- 로그인 때 토큰을 localStorage에 저장하고 로그아웃 때 지운다
- 앱이 시작할 때 토큰이 있으면 jwt-decode로 username을 꺼내 로그인 상태를 되살린다
- API 없음
- 끝나면 새로고침해도 로그인이 유지된다

### 10 board-save 글쓰기
- axios 인스턴스 http를 만든다
- 인터셉터가 요청마다 토큰을 Authorization에 붙인다
- 앞 장의 axios 호출도 http로 바꾼다
- 제목과 내용을 보내고 홈으로 간다
- API: POST /api/boards
- 끝나면 새 글이 목록 맨 위에 보인다

### 11 board-update-delete 글 수정과 삭제
- 상세에서 owner가 true일 때만 수정, 삭제 버튼을 보인다
- 수정 화면은 기존 제목과 내용을 채워 보인다
- 수정하면 상세로, 삭제하면 홈으로 간다
- API: PUT /api/boards/:id, DELETE /api/boards/:id
- 끝나면 내 글만 고치고 지울 수 있다

### 12 reply 댓글 쓰기와 삭제
- 상세의 댓글 입력에 작성 동작을 붙인다
- 작성하거나 삭제하면 상세를 다시 불러온다
- owner인 댓글에만 삭제 버튼을 보인다
- API: POST /api/replies, DELETE /api/replies/:id
- 끝나면 댓글이 바로 붙고 지워진다

### 13 my-info 내 정보 수정
- 내 정보를 받아 아이디(읽기만)와 이메일을 채운다
- 이메일과 새 비밀번호를 보낸다
- 비밀번호를 비우면 서버가 그대로 둔다
- API: GET /api/user, PUT /api/user
- 끝나면 바꾼 이메일이 다시 들어와도 보인다

### 14 react-query 서버 데이터를 TanStack Query로 (리팩터)
- main.jsx에 QueryClientProvider와 Devtools를 둔다
- queryKey는 계층으로 둔다. 목록 ["boards", "list"], 상세 ["boards", "detail", id], 내 정보 ["user"]
- 목록, 상세, 내 정보 조회를 useQuery로 바꾼다
- staleTime을 둬서 화면에 다시 들어오면 캐시를 바로 보인다
- 글, 댓글, 내 정보 쓰기를 useMutation으로 바꾼다
- 쓰기 뒤 바뀐 데이터의 키만 invalidateQueries로 stale로 만든다. 글 수정은 그 글 상세와 목록, 글쓰기와 삭제는 목록, 댓글은 그 글 상세, 내 정보 수정은 내 정보
- 화면에서 내려간 쿼리는 stale 표시만 되고 다시 들어갈 때 받는다는 것을 Devtools로 본다
- 로그아웃하면 queryClient.clear로 캐시를 비운다
- 화면 동작은 같다. Devtools 버튼만 생긴다

### 15 error-handling 에러 처리
- 목록과 상세를 받는 동안 isPending으로 로딩 표시를 보인다
- 없는 글은 isError와 응답 상태 404로 게시글이 없다는 안내와 목록 링크를 보인다
- http에 응답 인터셉터를 더해 서버 에러의 msg를 sonner 토스트로 보인다. 중복 아이디, 로그인 실패, 권한 없음
- 없는 주소는 path="*" 라우트로 안내한다
- 끝나면 실패한 요청마다 이유가 보인다

### 16 paging-search 페이징과 검색
- 목록 아래에 이전, 다음 버튼을 둔다. isFirst, isLast면 막는다
- 목록 위에 제목 검색창을 둔다
- 목록 키를 ["boards", "list", { page, keyword }]로 늘린다. 14장의 ["boards", "list"] 무효화가 모든 페이지에 걸린다
- placeholderData로 새 목록이 올 때까지 이전 목록과 입력창을 유지한다
- API: GET /?page=&keyword=
- 끝나면 페이지를 넘기고 제목으로 찾는다

### 17 search-debounce 검색 디바운스
- 검색어를 바로 요청에 쓰지 않고 입력이 멈추고 0.5초 뒤에 쓴다
- useEffect와 setTimeout으로 커스텀 훅 useDebounce를 만든다
- 새 라이브러리는 쓰지 않는다
- 끝나면 빠르게 쳐도 요청은 마지막 한 번만 간다

### 18 form-hook 폼을 react-hook-form으로 (리팩터)
- 회원가입, 로그인, 글쓰기, 글 수정, 댓글, 내 정보 폼의 form 객체와 handleChange를 register와 handleSubmit으로 바꾼다
- 글 수정과 내 정보 폼은 reset으로 값을 채운다
- register에 검사 규칙 하나를 둔다. 예: minLength. 틀리면 입력 아래에 errors 문구를 보이고 요청을 보내지 않는다
- 규칙 하나 말고는 화면 동작이 같다

### 19 auth-guard 로그인 확인
- 로그인하지 않으면 글쓰기와 내 정보 화면 대신 로그인 안내와 링크를 보인다
- 상세의 댓글 입력 자리에 로그인 안내를 보인다
- 남의 글 수정 화면은 폼 대신 안내를 보인다
- 끝나면 로그인 전에는 쓸 수 없다는 것이 먼저 보인다

## 합류 지점
- component-split: 그림완성, 통째로 screens

## 미룬 것
- 토큰 만료와 401 자동 로그아웃
- 버튼 중복 클릭 막기
- 공백만 입력한 값 막기
- 로그인한 뒤 로그인, 회원가입 화면 막기
- 저장된 토큰이 망가졌을 때 지우고 로그인 전으로 시작하기
- 글 삭제 전 확인 창

## 하지 않는 것
- react-blog-modern-end 코드 변경
- server-node 수정
- 학생이 쓰는 테스트 (vitest, msw)
- lucide-react 아이콘
- 좁은 화면에서 헤더 메뉴 접기
- 배포
- 댓글이 없을 때 안내
- 회원가입 비밀번호 확인 칸
- 다른 탭의 로그인, 로그아웃 따라가기
- zod 스키마 검사
- pattern 같은 여러 규칙의 입력 검사
- 글 수정 화면의 취소 버튼
