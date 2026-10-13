# login-keep 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| react-blog/src/store/authStore.jsx | 고침 | 로그인 때 토큰을 저장하고 로그아웃 때 지운다. 앱이 시작할 때 저장된 토큰으로 로그인 상태를 되살린다 |

- LoginForm.jsx와 Header.jsx는 고치지 않는다. 이미 스토어의 login, logout을 부른다

## 코드 계획
authStore.jsx
- jwt-decode에서 jwtDecode를 불러온다
- 스토어를 만들기 전에 localStorage.getItem("jwt")로 저장된 토큰을 savedJwt에 꺼낸다
- 스토어를 처음 만들 때가 앱이 시작할 때다
- savedJwt가 있으면 처음 값을 isLogin true, jwt savedJwt, username은 토큰에서 꺼낸 값으로 둔다
- savedJwt가 없으면 처음 값은 8장과 같다. isLogin false, jwt 빈 글자, username 빈 글자다
- 토큰은 "Bearer xxx"째로 저장한다. 꺼낼 때만 "Bearer "를 떼고 jwtDecode에 넘긴다
- login(jwt, username)은 localStorage.setItem("jwt", jwt)로 저장하고 상태를 바꾼다
- logout()은 localStorage.removeItem("jwt")로 지우고 처음 값으로 되돌린다

## 핵심 코드
const savedJwt = localStorage.getItem("jwt");

isLogin: savedJwt ? true : false,
jwt: savedJwt ? savedJwt : "",
username: savedJwt ? jwtDecode(savedJwt.replace("Bearer ", "")).username : "",

login: (jwt, username) => {
  localStorage.setItem("jwt", jwt);
  set({ isLogin: true, jwt, username });
},
logout: () => {
  localStorage.removeItem("jwt");
  set({ isLogin: false, jwt: "", username: "" });
},

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | authStore.jsx |
| S2 | authStore.jsx |
| S3 | authStore.jsx |

## 라이브러리
- jwt-decode 4 (contract에 있음)

## 다른 장 파일
- react-blog/src/store/authStore.jsx: login
