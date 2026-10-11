# server-node와 통신하는 React 블로그 라이브코딩

대상: React 기초, 라우팅, zustand를 배운 학생
결과물: 회원가입, 로그인, 글과 댓글 쓰기가 되는 블로그

| 번호 | 장 | 종류 | 배울 것 | 상태 | task | 사진 |
|---|---|---|---|---|---|---|
| 1 | project-setup 출발점 (강의 전 준비) | 기능 | 실행 방법, 폴더 구조 | 완료 | 4 | 5 |
| 2 | layout 레이아웃과 헤더 | 기능 | Layout과 Outlet, 헤더 메뉴, NavLink로 지금 메뉴 강조, Tailwind와 DaisyUI 최소 스타일 | 완료 | 4 | 5 |
| 3 | screens 화면 그리기와 라우트 | 기능 | 화면 7개 정적 마크업, 라우트 연결, grid 글 목록 | 완료 | 7 | 14 |
| 4 | component-split 겹치는 화면을 컴포넌트로 | 리팩터 | 컴포넌트 분리, props, children, props 펼침, map | 완료 | 6 | 13 |
| 5 | board-list 글 목록 | 기능 | axios GET, useEffect로 서버 데이터 그리기 | 완료 | 2 | 4 |
| 6 | board-detail 글 상세 | 기능 | useParams, 상세와 댓글 목록 그리기 | 완료 | 3 | 5 |
| 7 | join 회원가입 | 기능 | useState 폼, axios POST, 성공하면 이동 | 대기 | - | - |
| 8 | login 로그인 | 기능 | 응답 헤더 토큰, zustand 로그인 상태, 헤더 메뉴 바꾸기, 로그아웃 | 대기 | - | - |
| 9 | login-keep 로그인 유지 | 기능 | localStorage, jwt-decode로 복원 | 대기 | - | - |
| 10 | board-save 글쓰기 | 기능 | axios 인스턴스와 인터셉터로 토큰 보내기 | 대기 | - | - |
| 11 | board-update-delete 글 수정과 삭제 | 기능 | owner로 버튼 보이기, 기존 값 채운 폼, PUT과 DELETE | 대기 | - | - |
| 12 | reply 댓글 쓰기와 삭제 | 기능 | 요청 뒤 상세 다시 불러오기 | 대기 | - | - |
| 13 | my-info 내 정보 수정 | 기능 | 조회한 값으로 폼 채우기, PUT | 대기 | - | - |
| 14 | react-query 서버 데이터를 TanStack Query로 | 리팩터 | useQuery, useMutation, invalidateQueries, 로그아웃 때 캐시 비우기, Devtools | 대기 | - | - |
| 15 | paging-search 페이징과 검색 | 기능 | queryKey에 page와 keyword, 이전 화면 유지 | 대기 | - | - |
| 16 | search-debounce 검색 디바운스 | 기능 | 커스텀 훅 useDebounce, 입력이 멈춘 뒤 요청 | 대기 | - | - |
| 17 | form-hook 폼을 react-hook-form으로 | 리팩터 | register, handleSubmit, reset | 대기 | - | - |
| 18 | validation 입력 검사 | 기능 | zod 스키마, zodResolver, 에러 문구 | 대기 | - | - |
| 19 | error-handling 에러 처리 | 기능 | sonner 토스트, 로딩 표시, 없는 글 안내, errorElement | 대기 | - | - |
| 20 | auth-guard 로그인 확인 | 기능 | 로그인 안내, 남의 글 수정 막기 | 대기 | - | - |

## 미룬 것
- 토큰 만료와 401 자동 로그아웃: 장 정하지 않음
- 버튼 중복 클릭 막기: 장 정하지 않음
- 공백만 입력한 값 막기: 장 정하지 않음

## 하지 않는 것
- react-blog-modern-end 코드 변경
- server-node 수정
- 학생이 쓰는 테스트 (vitest, msw)
- lucide-react 아이콘
- 좁은 화면에서 헤더 메뉴 접기
- 배포
- 댓글이 없을 때 안내
