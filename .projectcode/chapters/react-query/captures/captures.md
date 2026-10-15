# 캡처

| 파일 | 장 | task | 커밋 | 찍은 화면 | 보이는 것 |
|---|---|---|---|---|---|
| T1-Devtools-빈-목록.png | react-query | T1 | 315aab9 | 홈 / 에서 연 Devtools | 오른쪽 아래 Devtools 버튼을 누르면 아래에 패널이 열리고 쿼리 목록이 비어 있다. 홈 글 목록은 그대로 보인다 |
| T2-목록-키.png | react-query | T2 | c82eaa4 | 홈 / 에서 연 Devtools | 글 목록이 그대로 보이고 Devtools 쿼리 목록에 ["boards","list"]가 있다. GET /?page=0 요청이 한 번 간다(T2-목록-키.requests.json) |
| T3-댓글-뒤-상세-다시-받기.png | react-query | T3 | fb3d259 | 로그인 뒤 제목4 상세 /board/4 | ssar로 제목4 상세에서 댓글 좋은 글이네요를 등록하면 댓글 목록 끝에 바로 붙는다. POST /api/replies 뒤에 GET /api/boards/4가 다시 간다(T3-댓글-뒤-상세-다시-받기.requests.json) |
| T4-수정-화면-상세-키.png | react-query | T4 | c5ade8f | 로그인 뒤 제목1 글 수정 /update-form/1 | ssar로 글 수정 화면에 들어가면 제목 칸에 제목1, 내용 칸에 내용1이 채워져 있다. Devtools에는 ["boards","detail","1"] 하나만 있다 |
| T5-내-정보-키.png | react-query | T5 | dd139e3 | 로그인 뒤 내 정보 /user-info | ssar로 내 정보에 들어가면 아이디 ssar, 이메일 ssar@nate.com이 채워져 있다. Devtools에 ["user"]가 있다 |
| T6-글쓰기-뒤-홈.png | react-query | T6 | 33a4743 | 글쓰기 뒤 홈 / | ssar로 제목5, 내용5를 쓰고 글쓰기를 누르면 홈으로 가고 제목5가 맨 위에 있다. POST /api/boards 뒤에 GET /?page=0이 간다(T6-글쓰기-뒤-홈.requests.json) |
| T7-수정-뒤-상세.png | react-query | T7 | 23b7212 | 글 수정 뒤 제목1 상세 /board/1 | ssar로 제목1을 제목1 수정됨으로 고치고 수정하기를 누르면 상세로 가고 바뀐 제목이 보인다. PUT /api/boards/1 뒤에 GET /api/boards/1이 간다. staleTime이 아직 없어 상세에 들어가며 GET /api/boards/1이 한 번 더 간다(T7-수정-뒤-상세.requests.json) |
| T8-삭제-뒤-홈.png | react-query | T8 | 14145d2 | 글 삭제 뒤 홈 / | ssar로 제목2 상세에서 삭제를 누르면 홈으로 가고 제목4, 제목3, 제목1만 보인다. Devtools에 ["boards","detail","2"]는 inactive로 남아 있다. DELETE /api/boards/2 뒤에 GET /?page=0이 간다(T8-삭제-뒤-홈.requests.json) |
| T9-댓글-쓰고-지우기.png | react-query | T9 | 50afe10 | 로그인 뒤 제목3 상세 /board/3 | ssar로 제목3 상세에서 댓글 반가워요를 등록했다가 지우면 댓글4만 남는다. POST /api/replies와 DELETE /api/replies/5 뒤에 GET /api/boards/3만 가고 목록 요청은 가지 않는다(T9-댓글-쓰고-지우기.requests.json) |
| T10-내-정보-수정-캐시.png | react-query | T10 | dfb6e80 | 내 정보 수정 뒤 홈 / 의 Devtools | ssar로 이메일을 ssar@gmail.com으로 고쳐 수정하면 홈으로 간다. Devtools에서 ["user"]를 열면 email이 ssar@gmail.com이다. PUT /api/user 뒤에 GET /api/user는 다시 가지 않는다(T10-내-정보-수정-캐시.requests.json) |
| T11-수정-뒤-상세-요청-없음.png | react-query | T11 | f9fc4ef | 글 수정 뒤 제목1 상세 /board/1 | T7과 같은 순서로 제목1을 고치면 상세로 가고 바뀐 제목이 보인다. 이번에는 PUT /api/boards/1 뒤에 GET /api/boards/1이 한 번만 간다. 상세는 1분 안이라 캐시로 바로 그린다(T11-수정-뒤-상세-요청-없음.requests.json) |
| T12-로그아웃-뒤-캐시.png | react-query | T12 | 61fbca2 | 내 정보를 본 뒤 로그아웃한 홈 / | ssar로 내 정보를 본 뒤 로그아웃하면 홈으로 가고 헤더가 로그인과 회원가입으로 바뀐다. Devtools에 ["user"]가 없고 ["boards","list"]만 있다. 로그아웃 뒤 GET /?page=0이 새로 간다(T12-로그아웃-뒤-캐시.requests.json) |
| done-홈-Devtools-키.png | react-query | done | 61fbca2 | 홈 / 에서 연 Devtools | 홈에 제목4, 제목3, 제목2가 보이고 오른쪽 아래 Devtools를 열면 ["boards","list"]가 fresh로 있다. 그 키를 누르면 받은 글 목록 데이터가 보인다 |
| done-글-수정-뒤-상세.png | react-query | done | 61fbca2 | 글 수정 뒤 제목1 상세 /board/1 | ssar로 제목1을 제목1 수정됨으로 고치면 상세로 가고 바뀐 제목이 처음부터 보인다. PUT /api/boards/1 뒤에 GET /api/boards/1이 한 번만 간다(done-글-수정-뒤-상세.requests.json) |
| done-내-정보-수정-캐시.png | react-query | done | 61fbca2 | 내 정보 수정 뒤 홈 / 의 Devtools | ssar로 이메일을 ssar@gmail.com으로 고쳐 수정하면 홈으로 가고 Devtools의 ["user"] 데이터에 ssar@gmail.com이 들어 있다. GET /api/user는 다시 가지 않는다(done-내-정보-수정-캐시.requests.json) |
| done-로그아웃-뒤-cos-내-정보.png | react-query | done | 61fbca2 | cos로 다시 로그인한 내 정보 /user-info | ssar로 내 정보를 본 뒤 로그아웃하고 cos로 로그인해 내 정보에 들어가면 아이디 cos, 이메일 cos@nate.com이 보인다. Devtools의 ["user"] 데이터도 cos다 |
