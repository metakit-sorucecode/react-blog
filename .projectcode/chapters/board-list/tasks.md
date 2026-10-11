# board-list 작업

- [x] 테스트 작성
- [x] T1 글 목록을 state로 바꾸고 빈 목록에서 시작하기
  - 근거: S2
  - 파일: react-blog/src/pages/Home.jsx
  - 실행하면: 홈에 카드가 하나도 없다
  - Why: 서버 응답은 늦게 오므로 화면은 빈 목록으로 먼저 그려지고 state가 바뀌면 다시 그려진다
  - 다른 장: component-split
- [ ] T2 useEffect에서 서버 글 목록 받아 그리기
  - 근거: S1, S3
  - 파일: react-blog/src/pages/Home.jsx
  - 실행하면: 제목4, 제목3, 제목2 카드가 보이고 제목4를 누르면 /board/4로 간다
  - Why: 화면이 그려진 뒤 한 번 서버에 물어 받은 글로 state를 채운다
  - 다른 장: component-split
- [ ] 수렴 점검
- [ ] 캡처
- [ ] 도식
