# 캡처

| 파일 | 장 | task | 커밋 | 찍은 화면 | 보이는 것 |
|---|---|---|---|---|---|
| T1-없는-글-요청-한-번.png | error-handling | T1 | bf19ff4 | 없는 글 상세 /board/9999 에서 연 Devtools | 헤더 아래 상세 자리가 비어 있다. Devtools를 열어 1초 넘게 기다려도 GET /api/boards/9999는 404로 한 번만 가고 다시 묻지 않는다(T1-없는-글-요청-한-번.requests.json) |
| T2-홈-로딩.png | error-handling | T2 | 07d1aee | ssar로 로그인한 뒤 목록을 받는 중인 홈 / | ssar님으로 로그인한 헤더 아래 가운데에 빙글 도는 로딩 표시가 보인다 |
| T3-없는-글-안내.png | error-handling | T3 | 1f7a8ae | 없는 글 상세 /board/9999 | 헤더 아래에 게시글이 없습니다와 목록으로 버튼이 보인다. GET /api/boards/9999는 404로 한 번만 간다(T3-없는-글-안내.requests.json) |
| T4-없는-주소-안내.png | error-handling | T4 | 457af37 | 없는 주소 /abc | 헤더 아래에 페이지를 찾을 수 없습니다와 홈으로 버튼이 보인다 |
| T5-권한-없음-토스트.png | error-handling | T5 | bc8fc5a | cos로 로그인한 뒤 ssar의 제목1 글 수정 /update-form/1 | cos로 ssar의 제목1 수정 화면에서 수정하기를 누르면 위 오른쪽에 권한이 없습니다 검정 토스트가 뜬다. PUT /api/boards/1이 403이다(T5-권한-없음-토스트.requests.json) |
| T6-로그인-실패-남기.png | error-handling | T6 | 0a2d854 | 로그인 /login-form | ssar에 틀린 비밀번호로 로그인하면 위 오른쪽에 아이디 또는 비밀번호가 틀렸습니다 토스트가 뜨고 로그인 화면에 남는다. POST /login이 400이다. 콘솔 기록의 에러는 400 응답 실패 한 줄뿐이고 Uncaught 줄은 없다(T6-로그인-실패-남기.console.txt) |
| T7-연결-실패-토스트.png | error-handling | T7 | 1bebd8d | 서버를 끈 홈 / 에서 연 Devtools | 서버를 끄고 홈에 들어가면 서버에 연결할 수 없습니다 토스트가 하나만 뜬다. 콘솔에는 연결 실패가 두 번 남아 한 번 더 물은 것이 보인다(T7-연결-실패-토스트.console.txt) |
| T8-안내-컴포넌트.png | error-handling | T8 | 45a85d9 | 없는 글 상세 /board/9999 | 헤더 아래에 전과 똑같이 게시글이 없습니다와 목록으로 버튼이 보인다 |
| done-로딩.png | error-handling | done | 45a85d9 | ssar로 로그인한 뒤 목록을 받는 중인 홈 / | ssar님으로 로그인한 헤더 아래 가운데에 빙글 도는 로딩 표시만 보이고 토스트는 없다 |
| done-없는-글.png | error-handling | done | 45a85d9 | ssar로 로그인한 뒤 없는 글 상세 /board/9999 | ssar로 로그인하고 /board/9999에 들어가면 헤더 아래에 게시글이 없습니다와 목록으로 버튼이 보이고 토스트는 없다. GET /api/boards/9999는 404로 한 번만 간다(done-없는-글.requests.json) |
| done-없는-주소.png | error-handling | done | 45a85d9 | 없는 주소 /abc | 헤더 아래에 페이지를 찾을 수 없습니다와 홈으로 버튼이 보인다 |
| done-토스트.png | error-handling | done | 45a85d9 | 회원가입 /join-form | 이미 있는 아이디 ssar로 가입하면 위 오른쪽에 이미 존재하는 유저네임입니다 검정 토스트가 뜨고 회원가입 화면에 남는다. POST /join이 400이다(done-토스트.requests.json) |
