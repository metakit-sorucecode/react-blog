# board-update-delete 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| react-blog/src/pages/Detail.jsx | 고침 | 내 글에만 수정, 삭제 버튼을 보이고 삭제를 누르면 지운 뒤 홈으로 간다 |
| react-blog/src/pages/UpdateForm.jsx | 고침 | 기존 제목과 내용을 채우고 수정하기를 누르면 보낸 뒤 상세로 간다 |

## 코드 계획
Detail.jsx
- 처음 board state에 owner: false를 더한다. 받기 전에는 버튼이 없다
- 수정, 삭제 버튼을 감싼 div를 {board.owner && (...)}로 감싼다
- useNavigate로 navigate를 꺼낸다
- handleDelete는 async 함수다. http.delete(`/api/boards/${id}`)로 지우고 navigate("/")로 홈에 간다
- 삭제 버튼에 onClick={handleDelete}를 붙인다
- 나머지 코드는 그대로다

UpdateForm.jsx
- useParams로 주소의 id를 꺼낸다
- 글쓰기처럼 form 객체 하나로 title, content를 기억한다. 처음은 빈 글자다
- useEffect에서 http.get(`/api/boards/${id}`)로 상세를 받는다. 의존성은 [id]다
- 받은 body에서 title과 content만 골라 setForm에 넣는다
- 응답을 통째로 넣지 않는다. 기존 값을 채운다는 것이 코드에 드러나고 PUT에도 두 값만 간다
- handleChange는 form을 복사하고 바뀐 칸만 덮어쓴다
- handleSubmit은 async 함수다. e.preventDefault()로 새로고침을 막는다
- http.put(`/api/boards/${id}`, form)으로 보내고 navigate(`/board/${id}`)로 상세에 간다
- FormCard에 onSubmit={handleSubmit}을 넘긴다
- 제목 Input에 name="title", value={form.title}, onChange={handleChange}를 붙인다
- 내용 textarea에 name="content", value={form.content}, onChange={handleChange}를 붙인다

## 핵심 코드
{board.owner && (
  <div className="flex gap-2">
    <Link to={`/update-form/${id}`} className="btn">수정</Link>
    <button className="btn" onClick={handleDelete}>삭제</button>
  </div>
)}

async function handleDelete() {
  await http.delete(`/api/boards/${id}`);
  navigate("/");
}

useEffect(() => {
  async function loadBoard() {
    const res = await http.get(`/api/boards/${id}`);
    setForm({ title: res.data.body.title, content: res.data.body.content });
  }
  loadBoard();
}, [id]);

await http.put(`/api/boards/${id}`, form);
navigate(`/board/${id}`);

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | Detail.jsx |
| S2 | UpdateForm.jsx |
| S3 | UpdateForm.jsx |
| S4 | UpdateForm.jsx |
| S5 | Detail.jsx |

## 라이브러리
- 추가 없음. axios 1, react-router-dom 7 (contract에 있음)

## 다른 장 파일
- board-detail: Detail.jsx
- component-split: UpdateForm.jsx
