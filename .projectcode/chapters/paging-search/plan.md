# paging-search 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| react-blog/src/pages/Home.jsx | 고침 | 페이지와 검색어로 목록을 받고 검색창, 이전과 다음 버튼, 결과 없음 안내를 보인다 |

## 코드 계획
Home.jsx
- page와 keyword를 useState 두 개로 기억한다. 처음 값은 0과 ""다
- 목록 키는 ["boards", "list", { page, keyword }]다. 페이지와 검색어마다 캐시 칸이 따로 생긴다
- 요청은 http.get("/", { params: { page, keyword } })다. 주소는 /?page=0&keyword=가 된다
- queryFn은 boards만이 아니라 res.data.body 전체를 돌려준다. boards, isFirst, isLast, totalPage, number를 쓴다
- placeholderData: keepPreviousData를 준다
- 새 키의 데이터가 올 때까지 바로 앞 키의 데이터를 대신 보인다
- 보일 데이터가 있어서 키가 바뀌어도 isPending이 되지 않는다. 그래서 로딩 표시로 바뀌지 않고 검색창의 글자와 커서가 남는다
- 처음 들어올 때는 앞 키의 데이터도 없어서 지금처럼 로딩 표시를 보인다
- 응답이 오면 받은 데이터로 바뀐다. 결과가 없으면 그때 안내를 보인다
- 디바운스와 따로 필요하다. 디바운스는 요청 수를 줄이고 이것은 요청을 기다리는 동안 보일 것을 정한다
- 검색창은 input className="input w-full mb-8" placeholder="제목 검색"이다. value는 keyword다
- 칠 때마다 setKeyword로 검색어를 바꾸고 setPage(0)으로 첫 페이지로 돌린다
- data.boards가 비었으면 p className="text-center"로 "검색 결과가 없습니다"를 보인다. 아니면 지금 grid를 보인다
- 아래 줄은 div className="flex justify-center items-center gap-4 mt-8"이다
- 이전은 button className="btn" disabled={data.isFirst}, 다음은 disabled={data.isLast}다
- 쪽 번호는 span에 {data.number + 1} / {data.totalPage}로 보인다
- 이전과 다음은 setPage(data.number - 1), setPage(data.number + 1)이다. 받는 동안에도 보이는 목록의 번호에서 움직인다
- 새 CSS는 없다. mockup.html과 같은 DaisyUI와 Tailwind 클래스만 쓴다

쓰기 뒤 무효화 (코드 그대로)
- SaveForm, UpdateForm, Detail의 ["boards", "list"] 무효화는 앞부분이 같은 모든 페이지와 검색 키에 걸린다
- refetchType all이라 글을 쓰는 순간 캐시에 있는 페이지와 검색 결과를 모두 바로 다시 받는다
- 그래서 글을 쓴 뒤 홈에서 다음을 누르면 쓰기 때 다시 받아 둔 새 2페이지가 보인다

## 핵심 코드
const [page, setPage] = useState(0);
const [keyword, setKeyword] = useState("");

const { data, isPending } = useQuery({
  queryKey: ["boards", "list", { page, keyword }],
  queryFn: async () => {
    const res = await http.get("/", { params: { page, keyword } });
    return res.data.body;
  },
  placeholderData: keepPreviousData,
});

<input
  className="input w-full mb-8"
  placeholder="제목 검색"
  value={keyword}
  onChange={(e) => {
    setKeyword(e.target.value);
    setPage(0);
  }}
/>

<button className="btn" disabled={data.isFirst} onClick={() => setPage(data.number - 1)}>
  이전
</button>
<span>{data.number + 1} / {data.totalPage}</span>

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | Home.jsx |
| S2 | Home.jsx |
| S3 | Home.jsx |
| S4 | Home.jsx |
| S5 | Home.jsx |
| S6 | Home.jsx |
| S7 | Home.jsx |
| S8 | Home.jsx (SaveForm, UpdateForm, Detail은 그대로) |

## 라이브러리
- 추가 없음. keepPreviousData는 @tanstack/react-query 5.101.2에 있다

## 다른 장 파일
- error-handling: Home.jsx
