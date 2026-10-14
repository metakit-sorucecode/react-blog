# reply 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| react-blog/src/pages/Detail.jsx | 고침 | 댓글을 등록하고 지운 뒤 상세를 다시 받는다 |
| react-blog/src/components/ReplyItem.jsx | 고침 | 내 댓글에만 휴지통을 보이고 누르면 삭제를 부른다 |

## 코드 계획
Detail.jsx
- useEffect 안의 loadBoard를 컴포넌트 바로 아래로 꺼낸다. 처음 받기, 댓글 등록 뒤, 댓글 삭제 뒤에 같은 함수를 부른다
- useEffect는 loadBoard()만 부른다. 의존성은 [id] 그대로다
- 댓글 입력은 칸이 하나라 form 객체를 쓰지 않는다. useState("")로 comment를 기억한다
- 댓글 input에 value={comment}, onChange={(e) => setComment(e.target.value)}를 붙인다
- handleReplySubmit은 async 함수다. e.preventDefault()로 새로고침을 막는다
- http.post("/api/replies", { boardId: id, comment })로 보내고 setComment("")로 칸을 비운 뒤 loadBoard()를 부른다
- 댓글 form에 onSubmit={handleReplySubmit}을 붙인다
- handleReplyDelete(replyId)는 http.delete(`/api/replies/${replyId}`)로 지우고 loadBoard()를 부른다
- ReplyItem에 owner={reply.owner}, onDelete={() => handleReplyDelete(reply.id)}를 더 넘긴다
- 나머지 코드는 그대로다

ReplyItem.jsx
- props에 owner와 onDelete를 더 받는다
- 휴지통 버튼을 {owner && (...)}로 감싼다
- 휴지통 버튼에 onClick={onDelete}를 붙인다

## 핵심 코드
async function loadBoard() {
  const res = await http.get(`/api/boards/${id}`);
  setBoard(res.data.body);
}

useEffect(() => {
  loadBoard();
}, [id]);

async function handleReplySubmit(e) {
  e.preventDefault();
  await http.post("/api/replies", { boardId: id, comment });
  setComment("");
  loadBoard();
}

async function handleReplyDelete(replyId) {
  await http.delete(`/api/replies/${replyId}`);
  loadBoard();
}

<ReplyItem
  key={reply.id}
  username={reply.username}
  comment={reply.comment}
  owner={reply.owner}
  onDelete={() => handleReplyDelete(reply.id)}
/>

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | Detail.jsx, ReplyItem.jsx |
| S2 | Detail.jsx |
| S3 | Detail.jsx |
| S4 | Detail.jsx |
| S5 | Detail.jsx, ReplyItem.jsx |

## 라이브러리
- 추가 없음. axios 1, react-router-dom 7 (contract에 있음)

## 다른 장 파일
- board-detail: Detail.jsx
- component-split: ReplyItem.jsx
