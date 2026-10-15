# error-handling 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| react-blog/src/components/Loading.jsx | 새로 | 빙글 도는 로딩 표시 |
| react-blog/src/pages/NotFound.jsx | 새로 | 없는 주소 안내와 홈 링크 |
| react-blog/src/components/Notice.jsx | 새로 | 안내 글 한 줄과 링크 버튼 |
| react-blog/src/api/http.jsx | 고침 | 응답 인터셉터로 연결 실패와 쓰기 실패를 토스트로 띄운다 |
| react-blog/src/main.jsx | 고침 | Toaster를 두고 조회의 다시 묻기 규칙(retry)을 정한다 |
| react-blog/src/App.jsx | 고침 | 없는 주소 라우트를 더한다 |
| react-blog/src/pages/Home.jsx | 고침 | 받는 동안 로딩을 보인다 |
| react-blog/src/pages/Detail.jsx | 고침 | 받는 동안 로딩, 없는 글이면 안내를 보인다 |
| react-blog/src/pages/UpdateForm.jsx | 고침 | 받는 동안 로딩을 보인다 |
| react-blog/src/pages/UserInfo.jsx | 고침 | 받는 동안 로딩을 보인다 |
| react-blog/src/pages/JoinForm.jsx | 고침 | 가입 실패면 이동하지 않는다 |
| react-blog/src/pages/LoginForm.jsx | 고침 | 로그인 실패면 이동하지 않는다 |

## 코드 계획
공통
- TanStack 옵션을 쓴 곳마다 주석을 단다. 첫 줄에 그 코드가 하는 일, 다음 줄들에 왜 그렇게 썼는지를 쓴다
- 클래스는 mockup.html과 같은 DaisyUI와 Tailwind 클래스를 쓴다. 새 CSS는 없다

Loading.jsx
- div text-center 안에 span loading loading-spinner loading-lg 하나를 둔다
- 네 화면이 똑같은 표시를 쓰니 컴포넌트로 뺀다

NotFound.jsx
- div text-center 안에 p "페이지를 찾을 수 없습니다"와 Link to="/" className="btn mt-4" "홈으로"를 둔다
- 라우트 하나가 보여주는 화면이라 pages에 둔다

Notice.jsx
- 없는 글 안내와 NotFound가 같은 모양이라 마지막 task에서 하나로 뺀다
- props는 text, to, label이다. div text-center 안에 p {text}와 Link to={to} className="btn mt-4" {label}을 둔다
- Detail은 Notice text="게시글이 없습니다" to="/" label="목록으로"를 돌려준다
- NotFound는 Notice text="페이지를 찾을 수 없습니다" to="/" label="홈으로"를 돌려준다

http.jsx
- interceptors.response.use에 성공은 그대로 돌려주고 실패만 다루는 함수 두 개를 준다
- error.response가 없으면 서버에 닿지 못한 것이다. toast("서버에 연결할 수 없습니다", { id: "network" })를 띄운다
- id를 주면 같은 id의 토스트는 새로 쌓이지 않고 그 자리를 바꾼다. 조회는 한 번 더 묻기 때문에 이 줄이 두 번 불려도 토스트는 하나다
- 응답이 있고 error.config.method가 "get"이 아니면 쓰기 실패다. toast(error.response.data.msg)를 띄운다
- 조회 실패는 토스트를 띄우지 않는다. 화면이 isError로 안내한다
- 끝에서 Promise.reject(error)로 에러를 그대로 넘긴다. 그래야 부른 쪽이 실패를 안다
- 토스트는 아이콘이 없는 toast()로 띄운다. toast.error는 빨간 아이콘이 붙어 시안과 다르다

main.jsx
- defaultOptions.queries.retry에 함수를 준다. (failureCount, error)를 받는다
- error.response가 있고 status가 500보다 작으면 false를 돌려준다. 400대는 다시 물어도 결과가 같다
- 그 밖에는 failureCount < 1을 돌려준다. 첫 실패의 failureCount는 0이라 한 번만 다시 묻는다
- 기본값은 3번 다시 묻기라서, 그대로 두면 없는 글 안내가 몇 초 늦게 뜬다
- 쓰기(useMutation)는 기본값이 다시 묻지 않기라서 그대로 둔다
- QueryClientProvider 안, App 옆에 Toaster를 둔다
- Toaster는 position="top-right"다. 오른쪽 아래는 Devtools 버튼 자리다
- toastOptions.style로 모양을 바꾼다. background black, color white, border none, padding "8px 16px"
- width "fit-content"와 right 0을 같이 준다. 토스트가 글 길이만큼만 넓고 오른쪽 끝에 붙는다

App.jsx
- Layout 라우트 안 맨 끝에 path="*" 라우트로 NotFound를 둔다. Layout 안이라 헤더 아래에 보인다

Home.jsx
- useQuery에서 isPending을 더 꺼낸다
- isPending이면 Loading을 돌려준다

Detail.jsx
- useQuery에서 isPending, isError, error를 더 꺼낸다
- 훅을 모두 부른 뒤 isPending이면 Loading을 돌려준다
- isError이면 error.response가 있고 status가 404인지 본다. 맞으면 div text-center 안에 p "게시글이 없습니다"와 Link to="/" className="btn mt-4" "목록으로"를 돌려준다
- 404가 아니면 연결 실패다. 토스트가 알렸으니 null을 돌려준다
- 받기 전 null을 돌려주던 if (!board)는 지운다. isPending과 isError가 그 자리를 맡는다

UpdateForm.jsx
- useQuery에서 isPending을 더 꺼낸다. 훅을 모두 부른 뒤 isPending이면 Loading을 돌려준다
- 수정 실패(권한 없음)는 인터셉터가 토스트를 띄운다. mutation이 실패해 onSuccess가 돌지 않으니 그 화면에 남는다. 쓰기 코드는 그대로다

UserInfo.jsx
- useQuery에서 isPending을 더 꺼낸다. 훅을 모두 부른 뒤 isPending이면 Loading을 돌려준다

JoinForm.jsx, LoginForm.jsx
- handleSubmit의 요청과 이동을 try로 감싼다
- catch는 비워 두고 주석만 단다. 실패 알림은 인터셉터가 띄웠고 여기서는 이동만 막는다
- try/catch가 없으면 handleSubmit 밖으로 나간 에러를 아무도 받지 않아 콘솔에 Uncaught (in promise)가 남는다
- useQuery와 useMutation을 쓰는 화면은 TanStack Query가 에러를 받아 두므로 try/catch가 필요 없다

## 핵심 코드
http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      toast("서버에 연결할 수 없습니다", { id: "network" });
    } else if (error.config.method !== "get") {
      toast(error.response.data.msg);
    }
    return Promise.reject(error);
  },
);

retry: (failureCount, error) => {
  if (error.response && error.response.status < 500) {
    return false;
  }
  return failureCount < 1;
},

<Toaster
  position="top-right"
  toastOptions={{
    style: { background: "black", color: "white", border: "none", padding: "8px 16px", width: "fit-content", right: 0 },
  }}
/>

const { data: board, isPending, isError, error } = useQuery(...)

if (isPending) {
  return <Loading />;
}
if (isError) {
  if (error.response && error.response.status === 404) {
    return (...게시글이 없습니다, 목록으로...);
  }
  return null;
}

<Route path="*" element={<NotFound />} />

try {
  await http.post("/join", form);
  alert("회원가입 완료");
  navigate("/login-form");
} catch {
  // 실패 알림은 인터셉터가 토스트로 띄웠다. 여기서는 이동만 막는다
}

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | Loading.jsx, Home.jsx, Detail.jsx, UpdateForm.jsx, UserInfo.jsx |
| S2 | Detail.jsx, main.jsx, http.jsx, Notice.jsx |
| S3 | http.jsx, main.jsx, JoinForm.jsx |
| S4 | http.jsx, main.jsx, LoginForm.jsx |
| S5 | http.jsx, main.jsx |
| S6 | http.jsx, main.jsx |
| S7 | main.jsx |
| S8 | NotFound.jsx, App.jsx, Notice.jsx |

## 라이브러리
- 추가 없음. sonner 1.7.4가 node_modules에 있고 contract.md에 있다

## 다른 장 파일
- react-query: main.jsx, Home.jsx, Detail.jsx, UpdateForm.jsx, UserInfo.jsx
- board-save: http.jsx, JoinForm.jsx, LoginForm.jsx
- layout: App.jsx
