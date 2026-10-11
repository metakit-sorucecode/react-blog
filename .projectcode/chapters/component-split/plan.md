# component-split 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| react-blog/src/components/BoardCard.jsx | 새로 | 글 카드 하나 |
| react-blog/src/components/ReplyItem.jsx | 새로 | 댓글 줄 하나 |
| react-blog/src/components/FormCard.jsx | 새로 | 폼 카드 틀과 제목 줄 |
| react-blog/src/components/Input.jsx | 새로 | input 클래스를 단 입력칸 |
| react-blog/src/components/BoardForm.jsx | 새로 | 글쓰기와 수정이 같이 쓰는 글 폼 |
| react-blog/src/pages/Home.jsx | 고침 | 글 배열을 map으로 돌려 BoardCard를 그린다 |
| react-blog/src/pages/Detail.jsx | 고침 | 댓글 배열을 map으로 돌려 ReplyItem을 그린다 |
| react-blog/src/pages/SaveForm.jsx | 고침 | BoardForm에 글쓰기 글자를 넘긴다 |
| react-blog/src/pages/UpdateForm.jsx | 고침 | BoardForm에 글 수정 글자를 넘긴다 |
| react-blog/src/pages/LoginForm.jsx | 고침 | FormCard와 Input을 쓴다 |
| react-blog/src/pages/JoinForm.jsx | 고침 | FormCard와 Input을 쓴다 |
| react-blog/src/pages/UserInfo.jsx | 고침 | FormCard와 Input을 쓴다 |

- 조각은 여러 화면이나 여러 번 쓰므로 pages가 아닌 components에 둔다
- 조각 하나에 파일 하나를 둔다. 조각마다 다른 화면에서 불러 쓴다
- BoardForm은 FormCard와 Input을 써서 조각 안에서 조각을 쓰는 모습을 보인다

## 코드 계획
BoardCard.jsx
- props에서 id, title을 구조 분해로 꺼낸다
- 3장 카드 마크업을 그대로 옮기고 링크 주소와 글자만 id, title로 바꾼다

ReplyItem.jsx
- props에서 username, comment를 꺼낸다
- 3장 li 마크업을 그대로 옮기고 작성자와 댓글 글자만 바꾼다

FormCard.jsx
- props에서 title, children을 꺼낸다
- form 클래스와 h1은 3장 그대로다. h1 아래에 children을 둔다

Input.jsx
- props를 통째로 받아 input에 펼쳐서 넘긴다
- className input은 조각이 단다. type, placeholder, value, readOnly는 쓰는 쪽이 넘긴다

BoardForm.jsx
- props에서 title, buttonText를 꺼낸다
- FormCard 안에 제목 Input, 내용 textarea, 버튼을 둔다
- textarea는 한 곳에만 있으니 태그 그대로 둔다

Home.jsx
- 함수 안에 boards 배열을 둔다. 원소는 id, title이다. 서버 목록 응답과 같은 이름이다
- grid div 안에서 boards.map으로 BoardCard를 그린다. key는 id다

Detail.jsx
- 함수 안에 replies 배열을 둔다. 원소는 id, username, comment다. 서버 상세 응답과 같은 이름이다
- ul 안에서 replies.map으로 ReplyItem을 그린다. key는 id다
- 제목, 버튼, 댓글 입력 form은 그대로다
- 댓글 입력칸은 Input으로 바꾸지 않는다. flex-1이 더 붙어 className 덮어쓰기를 설명해야 한다

SaveForm.jsx, UpdateForm.jsx
- BoardForm 한 줄만 돌려준다
- 글쓰기는 title 글쓰기, buttonText 글쓰기다
- 수정은 title 글 수정, buttonText 수정하기다

LoginForm.jsx, JoinForm.jsx, UserInfo.jsx
- form과 h1을 FormCard로 바꾸고 title을 넘긴다
- input을 Input으로 바꾼다. 넘기던 속성은 그대로 둔다
- 버튼은 태그 그대로 children에 둔다

## 핵심 코드
export default function BoardCard({ id, title }) {
  return (
    <div className="card border">
      <div className="card-body">
        <Link to={`/board/${id}`}>{title}</Link>
      </div>
    </div>
  );
}

{boards.map((board) => (
  <BoardCard key={board.id} id={board.id} title={board.title} />
))}

export default function FormCard({ title, children }) {
  return (
    <form className="card border max-w-sm mx-auto p-8 gap-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
    </form>
  );
}

export default function Input(props) {
  return <input className="input" {...props} />;
}

<FormCard title="로그인">
  <Input placeholder="아이디" />
  <Input type="password" placeholder="비밀번호" />
  <button className="btn">로그인</button>
</FormCard>

export default function SaveForm() {
  return <BoardForm title="글쓰기" buttonText="글쓰기" />;
}

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | BoardCard.jsx, Home.jsx |
| S2 | ReplyItem.jsx, Detail.jsx |
| S3 | FormCard.jsx, LoginForm.jsx, JoinForm.jsx, UserInfo.jsx, BoardForm.jsx |
| S4 | Input.jsx, LoginForm.jsx, JoinForm.jsx, UserInfo.jsx, BoardForm.jsx |
| S5 | BoardForm.jsx, SaveForm.jsx, UpdateForm.jsx |

## 라이브러리
- 추가 없음

## 다른 장 파일
- screens: Home.jsx, Detail.jsx, SaveForm.jsx, UpdateForm.jsx, LoginForm.jsx, JoinForm.jsx, UserInfo.jsx
