# 캡처

| 파일 | 장 | task | 찍은 화면 | 보이는 것 |
|---|---|---|---|---|
| T1-토큰-저장.png | login-keep | T1 | 로그인 뒤 새로고침한 / | localStorage에 jwt가 Bearer 토큰으로 남아 있다(T1-토큰-저장.storage.json). 새로고침한 화면의 헤더는 아직 홈, 로그인, 회원가입이다 |
| T2-로그인-되살리기.png | login-keep | T2 | 로그아웃하고 새로고침한 / | 로그아웃했는데 새로고침하면 헤더가 다시 홈, 글쓰기, 내 정보, 로그아웃, ssar님이다. localStorage에 jwt가 남아 있다 |
| T3-토큰-지우기.png | login-keep | T3 | 로그아웃하고 새로고침한 / | 로그아웃하고 새로고침해도 헤더가 홈, 로그인, 회원가입이다. localStorage가 비어 있다 |
| done-새로고침-로그인-유지.png | login-keep | done | 로그인 뒤 새로고침한 / | ssar로 로그인하고 새로고침해도 헤더가 홈, 글쓰기, 내 정보, 로그아웃, ssar님이다 |
| done-로그아웃-뒤-새로고침.png | login-keep | done | 로그아웃하고 새로고침한 / | 로그아웃하고 새로고침하면 헤더가 홈, 로그인, 회원가입이고 localStorage가 비어 있다 |
