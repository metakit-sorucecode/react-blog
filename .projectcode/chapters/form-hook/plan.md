# form-hook 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| react-blog/src/pages/JoinForm.jsx | 고침 | useForm으로 바꾸고 비밀번호 규칙과 문구를 둔다 |
| react-blog/src/pages/LoginForm.jsx | 고침 | useForm으로 바꾼다 |
| react-blog/src/pages/SaveForm.jsx | 고침 | useForm으로 바꾼다 |
| react-blog/src/pages/UpdateForm.jsx | 고침 | useForm으로 바꾸고 reset으로 값을 채운다 |
| react-blog/src/pages/UserInfo.jsx | 고침 | useForm으로 바꾸고 reset으로 값을 채운다 |
| react-blog/src/pages/Detail.jsx | 고침 | 댓글 폼을 useForm으로 바꾸고 등록 뒤 reset으로 비운다 |

## 코드 계획
공통
- useState form과 handleChange를 지운다
- const { register, handleSubmit } = useForm()으로 꺼낸다
- 입력칸에 {...register("이름")}를 펼친다. name, onChange, onBlur, ref가 들어간다
- Input은 받은 props를 input에 펼친다. React 19는 ref도 props로 넘겨서 Input.jsx는 그대로 둔다
- 제출 함수 이름은 onSubmit(data)로 바꾼다. handleSubmit은 react-hook-form의 함수다
- form에는 onSubmit={handleSubmit(onSubmit)}를 준다. handleSubmit이 새로고침을 막으니 e.preventDefault()는 지운다
- useMutation의 mutationFn은 (data)를 받고 onSubmit은 mutate(data)를 부른다
- 새 개념이 처음 나오는 줄에 하는 일을 주석으로 단다
- 새 CSS는 없다. 문구는 DaisyUI text-error와 Tailwind text-sm만 쓴다

JoinForm.jsx
- useForm({ mode: "onChange" })로 칠 때마다 검사한다
- formState에서 errors를 꺼낸다
- 비밀번호에 minLength { value: 4, message: "비밀번호는 4자 이상이어야 합니다" }를 준다
- 비밀번호 Input 바로 아래에 errors.password가 있을 때만 p className="text-error text-sm"로 message를 보인다
- 규칙이 틀리면 handleSubmit이 onSubmit을 부르지 않고 그 칸으로 커서를 옮긴다 (shouldFocusError 기본값)
- minLength는 빈 값을 검사하지 않는다. 빈 비밀번호는 지금처럼 서버가 막는다
- onSubmit의 try/catch, 알림, 이동은 그대로다. 보내는 값만 data다

LoginForm.jsx
- http.post("/login", data)로 보내고 login(jwt, data.username)을 부른다

SaveForm.jsx
- mutationFn: (data) => http.post("/api/boards", data)
- textarea에도 {...register("content")}를 펼친다

UpdateForm.jsx
- useEffect에서 board가 오면 reset({ title: board.title, content: board.content })로 채운다
- mutationFn: (data) => http.put(`/api/boards/${id}`, data)

UserInfo.jsx
- 아이디도 폼에 둔다. Input readOnly {...register("username")}로 보인다
- user.username을 바로 쓰지 않는다. 로그인 전에 주소로 들어오면 조회가 실패해 user가 없다. 막는 일은 auth-guard 장이 한다
- useEffect에서 user가 오면 reset({ username: user.username, email: user.email, password: "" })로 채운다. 새 비밀번호 칸은 비워 둔다
- 아이디는 보내지 않는다. mutationFn: (data) => http.put("/api/user", { email: data.email, password: data.password })

Detail.jsx
- useForm은 다른 훅과 함께 맨 위에서 부른다. 앞에서 돌려주는 if보다 먼저다
- saveReply의 mutationFn: (data) => http.post("/api/replies", { boardId: id, comment: data.comment })
- onSuccess에서 setComment("") 대신 reset()으로 입력칸을 비운다
- handleReplySubmit은 onReplySubmit(data)로 바꾸고 form에 handleSubmit(onReplySubmit)을 준다
- useState import를 지운다

## 핵심 코드
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({ mode: "onChange" });

<Input
  type="password"
  placeholder="비밀번호"
  {...register("password", {
    minLength: { value: 4, message: "비밀번호는 4자 이상이어야 합니다" },
  })}
/>
{errors.password && (
  <p className="text-error text-sm">{errors.password.message}</p>
)}

<FormCard title="회원가입" onSubmit={handleSubmit(onSubmit)}>

useEffect(() => {
  if (board) {
    reset({ title: board.title, content: board.content });
  }
}, [board, reset]);

onSuccess: () => {
  reset();
  queryClient.invalidateQueries({ queryKey: ["boards", "detail", id] });
},

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | JoinForm.jsx |
| S2 | LoginForm.jsx |
| S3 | SaveForm.jsx |
| S4 | UpdateForm.jsx |
| S5 | Detail.jsx |
| S6 | UserInfo.jsx |
| S7 | JoinForm.jsx |
| S8 | JoinForm.jsx |
| S9 | JoinForm.jsx |

## 라이브러리
- 추가 없음. react-hook-form 7.81.0이 node_modules에 있고 contract.md에 있다

## 다른 장 파일
- error-handling: JoinForm.jsx, LoginForm.jsx, UpdateForm.jsx, UserInfo.jsx, Detail.jsx
- react-query: SaveForm.jsx
