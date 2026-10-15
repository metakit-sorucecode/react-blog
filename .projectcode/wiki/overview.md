# server-node와 통신하는 React 블로그 라이브코딩

대상: React 기초, 라우팅, zustand를 배운 학생
결과물: 회원가입, 로그인, 글과 댓글 쓰기가 되는 블로그

| 번호 | 장 | 종류 | 배울 것 | 상태 | task | 사진 |
|---|---|---|---|---|---|---|
| 1 | project-setup 출발점 (강의 전 준비) | 기능 | 실행 방법, 폴더 구조 | 완료 | 4 | 5 |
| 2 | layout 레이아웃과 헤더 | 기능 | Layout과 Outlet, 헤더 메뉴, NavLink로 지금 메뉴 강조, Tailwind와 DaisyUI 최소 스타일 | 완료 | 5 | 5 |
| 3 | screens 화면 그리기와 라우트 | 기능 | 화면 7개 정적 마크업, 라우트 연결, grid 글 목록 | 완료 | 8 | 14 |
| 4 | component-split 겹치는 화면을 컴포넌트로 | 리팩터 | 컴포넌트 분리, props, children, props 펼침, map | 완료 | 7 | 13 |
| 5 | board-list 글 목록 | 기능 | axios GET, useEffect로 서버 데이터 그리기 | 완료 | 2 | 4 |
| 6 | board-detail 글 상세 | 기능 | useParams, 상세와 댓글 목록 그리기 | 완료 | 3 | 5 |
| 7 | join 회원가입 | 기능 | useState 폼, axios POST, 성공하면 이동 | 완료 | 4 | 6 |
| 8 | login 로그인 | 기능 | 응답 헤더 토큰, zustand 로그인 상태, 헤더 메뉴 바꾸기, 로그아웃 | 완료 | 5 | 8 |
| 9 | login-keep 로그인 유지 | 기능 | localStorage, jwt-decode로 복원 | 완료 | 3 | 5 |
| 10 | board-save 글쓰기 | 기능 | axios 인스턴스와 인터셉터로 토큰 보내기 | 완료 | 5 | 5 |
| 11 | board-update-delete 글 수정과 삭제 | 기능 | owner로 버튼 보이기, 기존 값 채운 폼, PUT과 DELETE | 완료 | 5 | 8 |
| 12 | reply 댓글 쓰기와 삭제 | 기능 | 요청 뒤 상세 다시 불러오기 | 완료 | 5 | 8 |
| 13 | my-info 내 정보 수정 | 기능 | 조회한 값으로 폼 채우기, PUT | 완료 | 3 | 6 |
| 14 | react-query 서버 데이터를 TanStack Query로 | 리팩터 | useQuery, useMutation, 계층 queryKey, staleTime, invalidateQueries와 refetchType, setQueryData, gcTime, navigate의 replace, 로그아웃 때 캐시 비우기, Devtools | 완료 | 24 | 16 |
| 15 | error-handling 에러 처리 | 기능 | isPending 로딩, isError로 없는 글 안내, 응답 인터셉터에서 sonner 토스트, 없는 주소 안내 | 진행 중 | - | - |
| 16 | paging-search 페이징과 검색 | 기능 | queryKey에 page와 keyword, 이전 화면 유지 | 대기 | - | - |
| 17 | search-debounce 검색 디바운스 | 기능 | 커스텀 훅 useDebounce, 입력이 멈춘 뒤 요청 | 대기 | - | - |
| 18 | form-hook 폼을 react-hook-form으로 | 리팩터 | register, handleSubmit, reset, 검사 규칙 하나와 errors 문구 | 대기 | - | - |
| 19 | auth-guard 로그인 확인 | 기능 | 로그인 안내, 남의 글 수정 막기 | 대기 | - | - |
| 20 | query-factory 쿼리 키와 조회를 한 곳에 | 리팩터 | 키 팩토리, queryOptions, 팩토리 키로 무효화 | 대기 | - | - |

## 미룬 것
- 토큰 만료와 401 자동 로그아웃: 장 정하지 않음
- 버튼 중복 클릭 막기: 장 정하지 않음
- 공백만 입력한 값 막기: 장 정하지 않음
- 로그인한 뒤 로그인, 회원가입 화면 막기: 장 정하지 않음
- 저장된 토큰이 망가졌을 때 지우고 로그인 전으로 시작하기: 장 정하지 않음
- 글과 댓글 삭제 전 확인 창: 장 정하지 않음

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
- 내 정보의 새 비밀번호 확인 칸
- 회원가입과 로그인 요청을 useMutation으로 바꾸기
- 글 상세 미리 받기 (prefetch)
- 낙관적 업데이트
