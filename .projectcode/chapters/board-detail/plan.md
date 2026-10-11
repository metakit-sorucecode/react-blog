# board-detail 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| react-blog/src/pages/Detail.jsx | 고침 | 주소의 글 번호로 상세를 받아 그린다 |

- 새 파일은 만들지 않는다. 요청이 상세 한 곳에만 있다
- ReplyItem은 component-split 그대로 쓴다

## 코드 계획
Detail.jsx
- 예시 replies 배열과 예시 글자를 지운다
- useParams로 주소의 id를 꺼낸다
- board를 useState로 기억한다. 처음 값은 title, content, username이 빈 글자이고 replies가 빈 배열인 객체다
- 처음 값 덕분에 받기 전에는 조건문 없이 빈 화면이다
- useEffect의 의존성 배열은 [id]다. 처음 한 번 받고 id가 바뀌면 다시 받는다
- useEffect 안에 async 함수를 만들고 바로 부른다
- axios.get으로 http://localhost:8080/api/boards/${id}를 부른다
- 응답의 res.data.body를 setBoard에 넣는다
- 제목, 작성자, 내용은 board.title, board.username, board.content로 그린다
- 댓글은 board.replies.map으로 ReplyItem을 그린다
- 수정 링크는 /update-form/${id}로 바꾼다
- 삭제 버튼, 댓글 휴지통, 댓글 입력은 그대로 둔다

## 핵심 코드
const { id } = useParams();
const [board, setBoard] = useState({ title: "", content: "", username: "", replies: [] });

useEffect(() => {
  async function loadBoard() {
    const res = await axios.get(`http://localhost:8080/api/boards/${id}`);
    setBoard(res.data.body);
  }
  loadBoard();
}, [id]);

<Link to={`/update-form/${id}`} className="btn">수정</Link>

## 수업에서 짚을 것
- useParams가 주는 id는 글자다. 주소에 그대로 넣으므로 숫자로 바꾸지 않는다
- 의존성 배열은 다시 그릴지가 아니라 다시 그린 뒤 effect를 또 실행할지 정한다
- effect 안에서 쓰는 id를 의존성에 넣는다. 같은 라우트에서 id만 바뀌면 Detail은 새로 생기지 않으므로, []이면 옛 글이 남는다
- 지금 앱에는 상세에서 다른 상세로 바로 가는 링크가 없어 이 차이가 화면에 보이지 않는다
- 의존성 배열을 아예 빼면 받기, 다시 그리기, 또 받기가 끝없이 돈다

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | Detail.jsx |
| S2 | Detail.jsx |
| S3 | Detail.jsx |
| S4 | Detail.jsx |
| S5 | Detail.jsx |

## 라이브러리
- axios, react-router-dom. contract.md에 있다

## 다른 장 파일
- component-split: Detail.jsx
