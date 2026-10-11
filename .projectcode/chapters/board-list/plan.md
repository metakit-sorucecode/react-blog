# board-list 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| react-blog/src/pages/Home.jsx | 고침 | 서버에서 받은 글 목록을 카드로 그린다 |

- 새 파일은 만들지 않는다. 요청이 홈 한 곳에만 있다
- BoardCard는 component-split 그대로 쓴다

## 코드 계획
Home.jsx
- 예시 boards 배열을 지운다
- boards를 useState([])로 기억한다. 처음에는 빈 배열이라 카드가 없다
- useEffect의 의존성 배열은 빈 배열이다. 화면이 처음 그려진 뒤 한 번 요청한다
- useEffect 안에 async 함수를 만들고 바로 부른다
- axios.get으로 http://localhost:8080/?page=0을 부른다
- 응답의 res.data.body.boards를 setBoards에 넣는다
- boards.map과 BoardCard는 그대로다

## 핵심 코드
const [boards, setBoards] = useState([]);

useEffect(() => {
  async function loadBoards() {
    const res = await axios.get("http://localhost:8080/?page=0");
    setBoards(res.data.body.boards);
  }
  loadBoards();
}, []);

## 수업에서 짚을 것
- main.jsx의 StrictMode 때문에 개발 중에는 useEffect가 두 번 돌고 네트워크 탭에 요청이 두 번 보인다
- 코드는 바꾸지 않고 설명만 한다

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | Home.jsx |
| S2 | Home.jsx |
| S3 | Home.jsx |

## 라이브러리
- axios. contract.md에 있다

## 다른 장 파일
- component-split: Home.jsx
