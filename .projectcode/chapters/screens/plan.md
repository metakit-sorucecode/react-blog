# screens 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| react-blog/src/pages/Home.jsx | 고침 | 글 카드 3개를 grid로 놓는다 |
| react-blog/src/pages/Detail.jsx | 새로 | 글 상세와 댓글 |
| react-blog/src/pages/SaveForm.jsx | 새로 | 글쓰기 폼 |
| react-blog/src/pages/UpdateForm.jsx | 새로 | 글 수정 폼 |
| react-blog/src/pages/LoginForm.jsx | 새로 | 로그인 폼 |
| react-blog/src/pages/JoinForm.jsx | 새로 | 회원가입 폼 |
| react-blog/src/pages/UserInfo.jsx | 새로 | 내 정보 폼 |
| react-blog/src/App.jsx | 고침 | 라우트 6개를 더한다 |

- 화면 하나에 파일 하나를 둔다. 라우트 하나가 화면 하나를 보여준다
- 컴포넌트는 나누지 않는다. 겹치는 마크업은 component-split 장에서 뺀다

## 코드 계획
Home.jsx
- div에 grid grid-cols-3 gap-8을 준다
- 카드 3개를 그대로 세 번 쓴다. map은 쓰지 않는다
- 카드는 card border, 안쪽은 card-body다
- 카드 제목은 Link로 /board/1, /board/2, /board/3에 연결한다

Detail.jsx
- h1(text-2xl font-bold) 제목1, p 작성자 ssar를 붙여 둔다
- 내용1은 p에 my-8을 줘 본문 자리를 띄운다
- 수정은 Link에 btn을 줘 /update-form/1로 간다. 삭제는 button에 btn을 준다
- hr(my-8) 아래 h2(font-bold) 댓글을 둔다
- 댓글 목록은 ul에 list, li에 list-row를 준다
- li 안에 작성자 span, 댓글 span, 휴지통 button(btn btn-ghost btn-xs) 순서로 둔다. 둘째 칸이 가운데를 채운다
- 댓글 2줄을 그대로 두 번 쓴다
- 댓글 입력은 form(flex gap-2 mt-4) 안에 input(input flex-1)과 등록 btn을 둔다

SaveForm.jsx, UpdateForm.jsx, LoginForm.jsx, JoinForm.jsx, UserInfo.jsx
- 다섯 폼은 같은 틀로 쓴다
- form에 card border max-w-sm mx-auto p-8 gap-4를 준다
- 맨 위 h1(text-2xl font-bold), 그 아래 입력칸들, 맨 아래 btn 하나
- 입력칸은 input, 내용은 textarea다. 이름은 placeholder로 보인다
- 비밀번호 칸은 type password다
- UserInfo의 아이디 칸은 value ssar와 readOnly다
- form에 onSubmit을 쓰지 않는다. 제출 동작은 각 폼 장에서 붙인다

App.jsx
- Layout의 children에 라우트 6개를 더한다
- board/:id, save-form, update-form/:id, login-form, join-form, user-info

## 핵심 코드
<div className="grid grid-cols-3 gap-8">
  <div className="card border">
    <div className="card-body">
      <Link to="/board/1">제목1</Link>
    </div>
  </div>
</div>

<li className="list-row">
  <span>cos</span>
  <span>댓글1</span>
  <button className="btn btn-ghost btn-xs">🗑</button>
</li>

<form className="card border max-w-sm mx-auto p-8 gap-4">
  <h1 className="text-2xl font-bold">로그인</h1>
  <input className="input" placeholder="아이디" />
  <input className="input" type="password" placeholder="비밀번호" />
  <button className="btn">로그인</button>
</form>

{ path: "board/:id", element: <Detail /> },
{ path: "update-form/:id", element: <UpdateForm /> },

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | Home.jsx |
| S2 | Home.jsx, App.jsx |
| S3 | Detail.jsx, App.jsx |
| S4 | Detail.jsx, App.jsx |
| S5 | SaveForm.jsx, App.jsx |
| S6 | UpdateForm.jsx, App.jsx |
| S7 | LoginForm.jsx, App.jsx |
| S8 | JoinForm.jsx, App.jsx |
| S9 | UserInfo.jsx, App.jsx |
| S10 | App.jsx |

## 라이브러리
- 추가 없음. 휴지통은 글자 🗑로 그린다

## 다른 장 파일
- layout: App.jsx, Home.jsx
- layout 테스트 S1, S2는 홈의 홈 제목을 찾는다. tdd에서 지금 동작에 맞게 고친다
