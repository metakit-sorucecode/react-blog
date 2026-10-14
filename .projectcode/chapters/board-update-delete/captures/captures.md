# 캡처

| 파일 | 장 | task | 커밋 | 찍은 화면 | 보이는 것 |
|---|---|---|---|---|---|
| T1-내-글에만-버튼.png | board-update-delete | T1 | df737ff | 로그인 뒤 상세 /board/1 | ssar로 로그인하면 내 글 /board/1에 수정과 삭제 버튼이 보인다 |
| T2-수정-입력값-기억.png | board-update-delete | T2 | 33b4768 | 글 수정 /update-form/1 | 빈 칸에서 시작해 제목 칸에 고친 제목, 내용 칸에 고친 내용이 그대로 남아 있다 |
| T3-기존-값-채우기.png | board-update-delete | T3 | ee0cbcd | 글 수정 /update-form/1 | /update-form/1에 들어가면 제목 칸에 제목1, 내용 칸에 내용1이 채워져 있다 |
| T4-수정-뒤-상세.png | board-update-delete | T4 | a42610c | 수정 뒤 상세 /board/1 | 수정하기를 누르면 /board/1로 가고 고친 제목과 고친 내용이 보인다. PUT /api/boards/1 요청에 토큰과 고친 값이 실려 간다(T4-수정-뒤-상세.requests.json) |
| T5-삭제-뒤-홈.png | board-update-delete | T5 | 0e254d5 | 삭제 뒤 홈 / | /board/1에서 삭제를 누르면 홈으로 가고 목록에 제목1이 없다. DELETE /api/boards/1 요청에 토큰이 실려 간다(T5-삭제-뒤-홈.requests.json) |
| done-내-글-상세.png | board-update-delete | done | 0e254d5 | 로그인 뒤 상세 /board/1 | ssar로 로그인하면 내 글 제목1 상세에 수정과 삭제 버튼이 보인다 |
| done-남의-글-상세.png | board-update-delete | done | 0e254d5 | 로그인 뒤 상세 /board/4 | ssar로 로그인해도 love의 글 제목4 상세에는 수정과 삭제 버튼이 없다 |
| done-글-수정.png | board-update-delete | done | 0e254d5 | 글 수정 /update-form/1 | 글 수정 화면에 기존 제목1과 내용1이 채워져 있다 |
