# my-info 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| react-blog/src/pages/UserInfo.jsx | 고침 | 내 정보를 받아 칸을 채우고 수정하기를 누르면 보낸 뒤 홈으로 간다 |

## 코드 계획
UserInfo.jsx
- 글 수정처럼 form 객체 하나로 username, email, password를 기억한다. 처음은 빈 글자다
- 아이디 Input은 value={form.username}과 readOnly만 둔다. 고칠 칸이 아니라서 name과 onChange를 붙이지 않는다
- 이메일 Input에 name="email", value={form.email}, onChange={handleChange}를 붙인다
- 새 비밀번호 Input에 name="password", value={form.password}, onChange={handleChange}를 붙인다
- handleChange는 form을 복사하고 바뀐 칸만 덮어쓴다
- useEffect에서 http.get("/api/user")로 내 정보를 받는다. 주소에 바뀌는 값이 없어서 의존성은 []다
- 받은 body에서 username과 email만 골라 setForm에 넣는다. 새 비밀번호는 빈 글자로 둔다
- handleSubmit은 async 함수다. e.preventDefault()로 새로고침을 막는다
- http.put("/api/user", { email: form.email, password: form.password })로 두 값만 보낸다. 아이디는 바꾸는 값이 아니다
- 비밀번호가 빈 글자면 서버가 그대로 둔다. 화면 코드는 따로 가리지 않는다
- 보낸 뒤 navigate("/")로 홈에 간다
- FormCard에 onSubmit={handleSubmit}을 넘긴다

## 핵심 코드
const [form, setForm] = useState({ username: "", email: "", password: "" });

useEffect(() => {
  async function loadUser() {
    const res = await http.get("/api/user");
    setForm({ username: res.data.body.username, email: res.data.body.email, password: "" });
  }
  loadUser();
}, []);

<Input value={form.username} readOnly />

await http.put("/api/user", { email: form.email, password: form.password });
navigate("/");

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | UserInfo.jsx |
| S2 | UserInfo.jsx |
| S3 | UserInfo.jsx |
| S4 | UserInfo.jsx |
| S5 | UserInfo.jsx |

## 라이브러리
- 추가 없음. axios 1, react-router-dom 7 (contract에 있음)

## 다른 장 파일
- component-split: UserInfo.jsx
