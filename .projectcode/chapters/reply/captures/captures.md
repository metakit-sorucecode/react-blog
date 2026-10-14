# 캡처

| 파일 | 장 | task | 커밋 | 찍은 화면 | 보이는 것 |
|---|---|---|---|---|---|
| T1-내-댓글에만-휴지통.png | reply | T1 | dbef290 | 로그인 뒤 상세 /board/4 | ssar로 로그인하면 /board/4의 댓글1, 댓글2에만 휴지통이 보이고 댓글3에는 없다 |
| T2-댓글-입력값-기억.png | reply | T2 | e5a2346 | 로그인 뒤 상세 /board/4 | 댓글 칸에 친 새 댓글이 그대로 남아 있다 |
| T3-등록-뒤-목록.png | reply | T3 | 0fd811d | 댓글 등록 뒤 상세 /board/4 | 등록을 누르면 댓글 목록 끝에 ssar와 새 댓글이 붙고 입력칸에는 새 댓글이 남아 있다. POST /api/replies 뒤 GET /api/boards/4가 다시 간다(T3-등록-뒤-목록.requests.json) |
| T4-등록-뒤-입력칸-비움.png | reply | T4 | b8ac0fe | 댓글 등록 뒤 상세 /board/4 | 등록하면 목록 끝에 ssar와 새 댓글이 붙고 입력칸이 빈다 |
| T5-삭제-뒤-목록.png | reply | T5 | 905a959 | 댓글 삭제 뒤 상세 /board/4 | cos로 로그인해 댓글3의 휴지통을 누르면 목록에서 댓글3이 사라진다. DELETE /api/replies/3 뒤 GET /api/boards/4가 다시 간다(T5-삭제-뒤-목록.requests.json) |
| done-내-댓글-휴지통.png | reply | done | 905a959 | 로그인 뒤 상세 /board/4 | ssar로 로그인하면 댓글1, 댓글2에만 휴지통이 있고 아래에 빈 댓글 입력칸과 등록 버튼이 있다 |
| done-댓글-등록-뒤.png | reply | done | 905a959 | 댓글 등록 뒤 상세 /board/4 | 등록하면 목록 끝에 휴지통이 달린 ssar 새 댓글이 붙고 입력칸이 빈다. POST /api/replies 요청에 토큰과 boardId, comment가 실려 간다(done-댓글-등록-뒤.requests.json) |
| done-댓글-삭제-뒤.png | reply | done | 905a959 | 댓글 삭제 뒤 상세 /board/4 | cos로 로그인해 댓글3의 휴지통을 누르면 댓글3이 사라지고 댓글1, 댓글2만 남는다. DELETE /api/replies/3 요청에 토큰이 실려 간다(done-댓글-삭제-뒤.requests.json) |
