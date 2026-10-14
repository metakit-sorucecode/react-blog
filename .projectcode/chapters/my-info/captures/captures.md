# 캡처

| 파일 | 장 | task | 커밋 | 찍은 화면 | 보이는 것 |
|---|---|---|---|---|---|
| T1-입력값-기억.png | my-info | T1 | 94fa920 | 로그인 뒤 내 정보 /user-info | 이메일 칸에 친 new@nate.com과 새 비밀번호 칸에 친 글자가 그대로 남아 있다. 아이디 칸은 아직 비어 있다 |
| T2-내-정보-채우기.png | my-info | T2 | 39b50a2 | 로그인 뒤 내 정보 /user-info | ssar로 로그인하고 내 정보에 들어가면 아이디 칸에 ssar, 이메일 칸에 ssar@nate.com이 채워져 있다 |
| T3-수정-뒤-다시-들어옴.png | my-info | T3 | ca83687 | 수정 뒤 다시 들어온 내 정보 /user-info | 이메일을 ssar@gmail.com으로 고치고 수정하기를 누르면 홈으로 간다. 내 정보에 다시 들어오면 ssar@gmail.com이 보인다. PUT /api/user 요청에 토큰과 email, password가 실려 간다(T3-수정-뒤-다시-들어옴.requests.json) |
| done-내-정보.png | my-info | done | ca83687 | 로그인 뒤 내 정보 /user-info | ssar로 로그인하면 내 정보에 아이디 ssar, 이메일 ssar@nate.com이 채워져 있고 새 비밀번호 칸은 비어 있다 |
| done-수정-뒤-다시-들어옴.png | my-info | done | ca83687 | 수정 뒤 다시 들어온 내 정보 /user-info | 이메일을 ssar@gmail.com으로 고쳐 수정하면 홈으로 가고 내 정보에 다시 들어오면 ssar@gmail.com이 보인다. PUT /api/user에 토큰과 email, 빈 password가 실려 간다(done-수정-뒤-다시-들어옴.requests.json) |
| done-새-비밀번호-로그인.png | my-info | done | ca83687 | 새 비밀번호로 로그인한 홈 / | 새 비밀번호 5678로 수정하고 로그아웃한 뒤 ssar, 5678로 로그인하면 홈 헤더에 ssar님이 보인다. 로그인 요청이 200이다(done-새-비밀번호-로그인.requests.json) |
