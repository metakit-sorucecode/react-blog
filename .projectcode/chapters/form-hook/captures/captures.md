# 캡처

| 파일 | 장 | task | 커밋 | 찍은 화면 | 보이는 것 |
|---|---|---|---|---|---|
| T1-가입-뒤-로그인.png | form-hook | T1 | a9da67f | 회원가입 /join-form 에서 가입한 뒤의 로그인 화면 | kim으로 가입하면 회원가입 완료 알림 뒤 로그인 화면으로 간다. 알림 창은 사진에 남지 않는다. POST /join이 폼 값 username, password, email을 보내고 200이다(T1-가입-뒤-로그인.requests.json) |
| T2-로그인-뒤-홈.png | form-hook | T2 | 8172bcc | 로그인 /login-form 에서 ssar로 로그인한 뒤의 홈 | ssar로 로그인하면 홈으로 가고 헤더 메뉴가 글쓰기, 내 정보, 로그아웃, ssar님으로 바뀐다. POST /login이 username과 password를 보낸다(T2-로그인-뒤-홈.requests.json) |
| T3-새-글-맨-위.png | form-hook | T3 | 8f2f34c | ssar로 로그인한 뒤 글쓰기 /save-form 에서 쓴 다음의 홈 | 새 글을 쓰면 홈으로 가고 목록 맨 위에 새 글 제목이 보인다. POST /api/boards가 title과 content를 보낸다(T3-새-글-맨-위.requests.json) |
| T4-고친-제목-상세.png | form-hook | T4 | 89ac93f | ssar로 로그인한 뒤 글 수정 /update-form/1 에서 제목만 고친 다음의 상세 | 제목만 고쳐 수정하기를 누르면 상세에 고친 제목1이 보이고 내용은 채워 둔 내용1 그대로다. PUT /api/boards/1이 title 고친 제목1, content 내용1을 보낸다(T4-고친-제목-상세.requests.json) |
| T5-댓글-붙고-빈칸.png | form-hook | T5 | b6389ff | ssar로 로그인한 뒤 상세 /board/1 에서 댓글을 등록한 다음 | 댓글이 없던 제목1에 ssar 새 댓글입니다가 붙고 댓글 입력칸은 비어 있다 |
| T6-바꾼-이메일.png | form-hook | T6 | e68bbca | ssar로 로그인한 뒤 내 정보 /user-info 에서 이메일을 고치고 다시 들어온 화면 | 다시 들어온 내 정보에 아이디 ssar와 바꾼 이메일 ssar@gmail.com이 채워져 있고 새 비밀번호 칸은 비어 있다 |
| T7-3자-가입-막힘.png | form-hook | T7 | 74d14c5 | 회원가입 /join-form 에서 비밀번호 3자로 가입하기를 누른 다음 | 비밀번호 123으로 가입하기를 누르면 회원가입 화면에 남고 비밀번호 칸 아래에 빨간 비밀번호는 4자 이상이어야 합니다가 뜨고 비밀번호 칸에 커서가 있다. 서버로 간 요청이 없다(T7-3자-가입-막힘.requests.json이 빈 배열) |
| T8-누르기-전-문구.png | form-hook | T8 | 8200900 | 회원가입 /join-form 에서 비밀번호에 3자를 친 다음 | 가입하기를 누르기 전인데 비밀번호에 123을 치자 칸 아래에 빨간 비밀번호는 4자 이상이어야 합니다가 보인다 |
| T9-로그인-전-빈-폼.png | form-hook | T9 | 95e3a35 | 로그인하지 않고 들어간 내 정보 /user-info | 로그인하지 않고 /user-info에 들어가도 화면이 깨지지 않고 내 정보 제목 아래 빈 아이디, 이메일, 새 비밀번호 칸과 수정하기 버튼이 보인다. 콘솔에는 GET /api/user의 401 실패 한 줄만 있고 Uncaught 줄은 없다(T9-로그인-전-빈-폼.console.txt) |
| done-비밀번호-문구.png | form-hook | done | 95e3a35 | 회원가입 /join-form 에서 비밀번호에 3자를 친 다음 | 아이디 kim, 비밀번호 123을 치면 누르기 전에 비밀번호 칸 아래에 빨간 비밀번호는 4자 이상이어야 합니다가 보인다 |
| done-빈-비밀번호.png | form-hook | done | 95e3a35 | 회원가입 /join-form 에서 비밀번호를 비운 채 가입하기를 누른 다음 | 비밀번호를 쳤다가 비우면 문구가 사라지고, 그대로 가입하기를 누르면 위 오른쪽에 입력값이 필요합니다 토스트가 뜨고 회원가입 화면에 남는다. POST /join이 400이다(done-빈-비밀번호.requests.json) |
