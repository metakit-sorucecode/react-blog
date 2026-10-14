# board-save 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| react-blog/src/api/http.jsx | 새로 | 서버 주소와 토큰 붙이기를 한 곳에 둔 axios 인스턴스 |
| react-blog/src/pages/SaveForm.jsx | 고침 | 제목과 내용을 기억하고 글쓰기를 누르면 보낸 뒤 홈으로 간다 |
| react-blog/src/components/BoardForm.jsx | 고침 | 받은 form, onChange, onSubmit을 입력칸과 폼에 연결한다 |
| react-blog/src/pages/Home.jsx | 고침 | axios 대신 http로 목록을 받는다 |
| react-blog/src/pages/Detail.jsx | 고침 | axios 대신 http로 상세를 받는다 |
| react-blog/src/pages/JoinForm.jsx | 고침 | axios 대신 http로 회원가입을 보낸다 |
| react-blog/src/pages/LoginForm.jsx | 고침 | axios 대신 http로 로그인을 보낸다 |

- 모든 화면이 같은 서버 주소와 같은 토큰 붙이기를 써야 해서 http를 따로 둔다
- 서버와 통신하는 코드라서 api 폴더에 둔다
- contract가 src 파일을 모두 .jsx로 쓰게 해서 http도 .jsx다

## 코드 계획
http.jsx
- axios.create로 http를 만들고 baseURL을 http://localhost:8080으로 둔다
- http.interceptors.request.use로 요청을 보내기 전에 config를 받는다
- localStorage.getItem("jwt")로 토큰을 꺼낸다. 9장에서 배운 방법이다
- 토큰이 있으면 config.headers.Authorization에 넣는다. 토큰은 "Bearer xxx"째로 저장돼 있다
- config를 돌려준다
- export default http로 내보낸다

SaveForm.jsx
- 회원가입처럼 form 객체 하나로 title, content를 기억한다
- handleChange는 form을 복사하고 바뀐 칸만 덮어쓴다
- handleSubmit은 async 함수다. e.preventDefault()로 새로고침을 막는다
- http.post("/api/boards", form)으로 보내고 useNavigate로 /에 간다
- BoardForm에 form, onChange={handleChange}, onSubmit={handleSubmit}을 넘긴다

BoardForm.jsx
- props로 title, buttonText, form, onChange, onSubmit을 받는다
- 수정 화면은 아직 form을 넘기지 않으므로 form = {}를 기본값으로 둔다. 11장에서 수정 화면도 form을 넘긴다
- FormCard에 onSubmit을 넘긴다
- 제목 Input에 name="title", value={form.title}, onChange를 붙인다
- 내용 textarea에 name="content", value={form.content}, onChange를 붙인다

Home.jsx, Detail.jsx, JoinForm.jsx, LoginForm.jsx
- import axios를 import http from "../api/http"로 바꾼다
- axios.get, axios.post를 http.get, http.post로 바꾸고 주소에서 http://localhost:8080을 뺀다
- 나머지 코드는 그대로다

## 핵심 코드
const http = axios.create({ baseURL: "http://localhost:8080" });

http.interceptors.request.use((config) => {
  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    config.headers.Authorization = jwt;
  }
  return config;
});

await http.post("/api/boards", form);
navigate("/");

export default function BoardForm({ title, buttonText, form = {}, onChange, onSubmit }) {

<Input name="title" placeholder="제목" value={form.title} onChange={onChange} />

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | SaveForm.jsx, BoardForm.jsx |
| S2 | http.jsx, SaveForm.jsx |
| S3 | SaveForm.jsx |
| S4 | http.jsx, Home.jsx, Detail.jsx |

## 라이브러리
- 추가 없음. axios 1 (contract에 있음)

## 다른 장 파일
- component-split: BoardForm.jsx, SaveForm.jsx
- board-list: Home.jsx
- board-detail: Detail.jsx
- join: JoinForm.jsx
- login: LoginForm.jsx
