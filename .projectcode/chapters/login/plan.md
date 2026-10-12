# login 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| react-blog/src/store/authStore.jsx | 새로 | 로그인 상태와 로그인, 로그아웃 함수를 담는다 |
| react-blog/src/pages/LoginForm.jsx | 고침 | 입력값을 보내고 받은 토큰과 아이디로 로그인한 뒤 홈으로 간다 |
| react-blog/src/components/Header.jsx | 고침 | 로그인 여부에 따라 메뉴를 바꾸고 로그아웃한다 |

- 로그인 폼과 헤더가 같은 로그인 상태를 봐야 해서 스토어를 따로 둔다
- contract가 src 파일을 모두 .jsx로 쓰게 해서 스토어도 .jsx다

## 코드 계획
authStore.jsx
- zustand의 create로 useAuthStore를 만든다
- 처음 값은 isLogin false, jwt 빈 글자, username 빈 글자다
- login(jwt, username)은 isLogin을 true로 하고 두 값을 넣는다
- logout()은 처음 값으로 되돌린다

LoginForm.jsx
- 회원가입처럼 form 객체 하나로 username, password를 기억한다
- 두 Input에 name, value, onChange={handleChange}를 붙인다
- handleChange는 form을 복사하고 바뀐 칸만 덮어쓴다
- 스토어에서 login을 꺼낸다
- handleSubmit은 async 함수다. e.preventDefault()로 새로고침을 막는다
- axios.post로 http://localhost:8080/login에 form을 보낸다
- 응답 헤더 res.headers.authorization을 jwt로 꺼낸다. "Bearer xxx"를 그대로 둔다
- login(jwt, form.username)을 부르고 useNavigate로 /에 간다
- FormCard에 onSubmit={handleSubmit}을 넘긴다

Header.jsx
- 스토어에서 isLogin, username, logout을 꺼낸다
- 홈 메뉴는 늘 보인다
- isLogin이 false면 로그인, 회원가입 메뉴를 보인다
- isLogin이 true면 글쓰기, 내 정보 메뉴, 로그아웃 버튼, username님을 보인다
- 두 묶음은 삼항 연산자와 Fragment로 고른다
- 로그아웃 버튼은 li 안의 button이다. 누르면 logout()을 부르고 /에 간다

## 핵심 코드
export const useAuthStore = create((set) => ({
  isLogin: false,
  jwt: "",
  username: "",
  login: (jwt, username) => set({ isLogin: true, jwt, username }),
  logout: () => set({ isLogin: false, jwt: "", username: "" }),
}));

const login = useAuthStore((state) => state.login);

const res = await axios.post("http://localhost:8080/login", form);
const jwt = res.headers.authorization;
login(jwt, form.username);
navigate("/");

{isLogin ? (
  <>
    <li><NavLink to="/save-form">글쓰기</NavLink></li>
    <li><button onClick={handleLogout}>로그아웃</button></li>
    <li><span>{username}님</span></li>
  </>
) : (
  <>
    <li><NavLink to="/login-form">로그인</NavLink></li>
  </>
)}

## 수업에서 짚을 것
- 토큰은 응답 body가 아니라 응답 헤더에 온다. axios는 헤더 이름을 소문자로 준다
- 서버가 Authorization 헤더를 열어 두어서 브라우저가 읽을 수 있다
- 응답에 아이디가 없어서 입력한 form.username을 쓴다
- 헤더와 로그인 폼은 서로 props를 주고받지 않는다. 같은 스토어를 보면 로그인하자마자 헤더가 바뀐다
- 스토어는 메모리에만 있어서 새로고침하면 로그아웃된다. login-keep 장에서 고친다
- jwt에 Bearer를 붙인 채 두면 board-save 장에서 그대로 헤더에 붙일 수 있다

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | LoginForm.jsx |
| S2 | LoginForm.jsx, authStore.jsx |
| S3 | Header.jsx, authStore.jsx |
| S4 | Header.jsx |
| S5 | Header.jsx, authStore.jsx |

## 라이브러리
- zustand, axios, react-router-dom. contract.md에 있다

## 다른 장 파일
- component-split: LoginForm.jsx
- layout: Header.jsx
