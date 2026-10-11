# 프로젝트 규칙

## 기술
| 항목 | 선택 |
|---|---|
| 프론트 | React 19, Vite 5 |
| 라우터 | react-router-dom 7 |
| 스타일 | Tailwind 4, DaisyUI 5 |
| 통신 | axios 1 |
| 상태 | zustand 5, jwt-decode 4 |
| 서버 데이터 | @tanstack/react-query 5, react-query-devtools 5 |
| 폼 | react-hook-form 7, zod 3, @hookform/resolvers 3 |
| 알림 | sonner 1 |
| 백엔드 | server-node 그대로 (Express 4, lowdb, JWT) |
| 패키지 관리자 | npm |
| 포맷 | prettier |
| 화면 테스트 | Playwright |

- 프론트 라이브러리는 react-blog-modern-start의 node_modules에 있는 버전만 쓴다
- 은행 PC가 오프라인이라 새 라이브러리를 설치할 수 없다
- Playwright는 하네스 확인용이다. 실습 키트에 넣지 않는다

## 출발점
- react-blog-modern-start를 복사해 시작한다. 인터넷이 없어 create-vite를 쓸 수 없다
- 라이브러리는 node_modules에 미리 설치되어 있다
- src 파일은 모두 .jsx로 쓴다. 설정 파일은 .js로 둔다

## 디자인
- Tailwind와 DaisyUI를 쓴다
- DaisyUI 기본 light 테마로 흰 바탕, 검정 글자를 쓴다
- 버튼, 입력칸, 카드는 DaisyUI 클래스 하나로 그린다. 예: btn, input, card
- Tailwind는 여백, 마진, grid에만 쓴다
- 색과 꾸밈 클래스는 더하지 않는다
- 화면마다 클래스를 가장 적게 쓴다

## 폴더
| 폴더 | 내용 |
|---|---|
| server-node | 블로그 API 서버 |
| react-blog | 학생과 함께 만드는 프론트 |
| tests/<장> | 장별 행동 테스트 |

## 실행
- 서버: cd server-node, npm start (8080)
- 서버 데이터 초기화: db.json을 지우고 다시 실행
- 프론트: cd react-blog, npm run dev (5173)
- 프론트 포트는 5173만 쓴다. 서버 CORS가 5173만 허용한다
- 테스트: 루트에서 npx playwright test

## 테스트
- Playwright가 서버와 프론트를 함께 띄운다
- 서버는 db.json을 지운 시드 상태로 시작한다
- 시드 계정: ssar, cos, love (비밀번호 1234)

## 캡처
- 화면: Playwright가 브라우저 화면을 PNG로 저장한다
- API: 요청과 응답을 JSON으로 저장한다
