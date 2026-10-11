# join 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| react-blog/src/pages/JoinForm.jsx | 고침 | 입력값을 기억하고 가입 요청을 보낸 뒤 로그인 화면으로 간다 |
| react-blog/src/components/FormCard.jsx | 고침 | onSubmit을 props로 받아 form에 붙인다 |

- 새 파일은 만들지 않는다
- FormCard가 form을 그리므로 제출 함수는 props로 넘긴다
- Input은 component-split 그대로 쓴다. 받은 props를 펼치므로 value와 onChange가 input에 붙는다

## 코드 계획
FormCard.jsx
- props에서 onSubmit을 더 꺼낸다
- form에 onSubmit={onSubmit}을 붙인다

JoinForm.jsx
- username, password, email을 useState 세 개로 기억한다. 처음 값은 빈 글자다
- 세 Input에 value와 onChange를 붙인다
- handleSubmit은 async 함수다
- e.preventDefault()로 새로고침을 막는다
- axios.post로 http://localhost:8080/join에 username, password, email을 보낸다
- 응답을 받으면 alert로 회원가입 완료를 띄운다
- useNavigate로 /login-form에 간다
- FormCard에 onSubmit={handleSubmit}을 넘긴다

## 핵심 코드
const [username, setUsername] = useState("");

<Input
  placeholder="아이디"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>

async function handleSubmit(e) {
  e.preventDefault();
  await axios.post("http://localhost:8080/join", { username, password, email });
  alert("회원가입 완료");
  navigate("/login-form");
}

<FormCard title="회원가입" onSubmit={handleSubmit}>

export default function FormCard({ title, onSubmit, children }) {
  return <form onSubmit={onSubmit} ...>

## 수업에서 짚을 것
- 서버가 받는 이름이 username이라 state 이름도 username으로 맞춘다. 객체에 그대로 넣을 수 있다
- form 안의 버튼은 누르면 제출된다. 막지 않으면 페이지가 새로고침되어 state가 사라진다
- await가 있어서 서버 응답을 받은 뒤에 안내와 이동이 일어난다
- 실패하면 await에서 멈추고 콘솔에 에러만 남는다. 안내는 error-handling 장에서 한다

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | JoinForm.jsx, FormCard.jsx |
| S2 | JoinForm.jsx |
| S3 | JoinForm.jsx |

## 라이브러리
- axios, react-router-dom. contract.md에 있다

## 다른 장 파일
- component-split: FormCard.jsx, JoinForm.jsx
