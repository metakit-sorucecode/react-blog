# 캡처

| 파일 | 장 | task | 커밋 | 찍은 화면 | 보이는 것 |
|---|---|---|---|---|---|
| T1-입력값-기억.png | board-save | T1 | 5926288 + fixes | 글쓰기 /save-form | 제목 칸에 제목 새 글, 내용 칸에 새 내용이 그대로 남아 있다 |
| T2-http로-목록.png | board-save | T2 | 9c3aa14 + fixes | 홈 / | http로 받은 서버 글 목록이 전처럼 카드로 보인다. 목록 요청 주소는 http://localhost:8080/?page=0이다(T2-http로-목록.requests.json) |
| T3-토큰-붙이기.png | board-save | T3 | 6d5e15c + fixes | 로그인 뒤 / | 로그인 뒤 홈의 목록 요청에 Authorization: Bearer 토큰이 붙어 있다(T3-토큰-붙이기.requests.json) |
| T4-글쓰기-뒤-홈.png | board-save | T4 | 4c63fd9 + fixes | 글쓰기 뒤 / | 글쓰기를 누르면 홈으로 가고 제목 새 글이 목록 맨 위에 보인다 |
| done-글쓰기-뒤-홈.png | board-save | done | 7eea75f + fixes | 글쓰기 뒤 / | 새 글이 목록 맨 위에 보인다. POST /api/boards 요청에 토큰과 제목, 내용이 실려 가고 응답은 200이다(done-글쓰기-뒤-홈.requests.json) |
