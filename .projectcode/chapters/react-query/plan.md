# react-query 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| react-blog/src/main.jsx | 고침 | QueryClient를 만들고 앱을 QueryClientProvider로 감싸고 Devtools를 둔다 |
| react-blog/src/pages/Home.jsx | 고침 | 목록을 useQuery로 받는다 |
| react-blog/src/pages/Detail.jsx | 고침 | 상세를 useQuery로 받고 글 삭제, 댓글 쓰기, 댓글 삭제를 useMutation으로 보낸다 |
| react-blog/src/pages/UpdateForm.jsx | 고침 | 상세 키로 기존 값을 채우고 수정을 useMutation으로 보낸다 |
| react-blog/src/pages/SaveForm.jsx | 고침 | 글쓰기를 useMutation으로 보낸다 |
| react-blog/src/pages/UserInfo.jsx | 고침 | 내 정보를 useQuery로 받고 수정 응답을 setQueryData로 넣는다 |
| react-blog/src/components/Header.jsx | 고침 | 로그아웃 때 캐시를 비운다 |

## 코드 계획
공통
- TanStack 옵션을 쓴 곳마다 주석을 단다. 첫 줄에 그 코드가 하는 일, 다음 줄들에 이 상황에서 왜 그렇게 되는지를 쓴다
- 옵션 이름은 처음 나오는 곳에서만 풀어 쓴다

main.jsx
- QueryClient를 main.jsx에서 만든다. 화면은 useQueryClient로 꺼내 쓰니 파일을 나누지 않는다
- defaultOptions.queries.staleTime을 60 * 1000으로 둔다
- refetchOnWindowFocus는 쓰지 않고 기본 동작을 주석으로 적는다
- App을 QueryClientProvider로 감싸고 App 옆에 ReactQueryDevtools를 둔다. 기본 위치인 오른쪽 아래 버튼을 쓴다

Home.jsx
- useState와 useEffect를 지우고 useQuery 하나로 바꾼다
- 키는 ["boards", "list"]다. queryFn은 res.data.body.boards를 돌려준다
- data를 boards로 받고 기본값 빈 배열을 준다. 받기 전에는 빈 목록이다

Detail.jsx
- board useState, loadBoard, useEffect를 지우고 useQuery로 바꾼다
- 키는 ["boards", "detail", id]다. queryFn은 res.data.body 전체를 돌려준다. 수정 화면과 같은 키라서 같은 모양이어야 한다
- 훅을 모두 부른 뒤 board가 없으면 null을 돌려준다. 받기 전에는 빈 화면이다
- 글 삭제 useMutation은 onSuccess에서 목록을 refetchType all로 무효화하고 기다린 뒤 navigate("/", { replace: true })로 간다
- 지운 글 상세 캐시는 빼지 않는다. 볼 화면이 없어 gcTime 5분 뒤 사라진다
- 이동 중에도 상세가 한 번 더 그려진다. 그때 키를 빼 두면 다시 요청하므로 removeQueries를 쓰지 않는다
- 댓글 쓰기 useMutation은 onSuccess에서 입력칸을 비우고 상세 키를 무효화한다. 보고 있어 기본 active로 바로 받는다
- 댓글 삭제 useMutation은 mutationFn이 replyId를 받는다. onSuccess에서 상세 키를 무효화한다
- handleDelete, handleReplySubmit, handleReplyDelete는 그대로 두고 안에서 mutate를 부른다

UpdateForm.jsx
- useQuery 키는 상세와 같은 ["boards", "detail", id]다. queryFn도 상세와 같은 요청과 모양이다. 두 곳뿐이라 함수로 빼지 않는다
- form useState는 그대로 둔다. useEffect가 board가 오면 제목과 내용을 채운다
- 수정 useMutation은 onSuccess에서 목록을 refetchType all로 무효화하고 기다리지 않는다
- 이어서 상세 키를 무효화하고 기다린다. 수정 화면이 상세 키를 보고 있어 active로 바로 받는다
- 다 받은 뒤 상세로 간다

SaveForm.jsx
- 글쓰기 useMutation은 onSuccess에서 목록을 refetchType all로 무효화하고 기다린 뒤 홈으로 간다

UserInfo.jsx
- useQuery 키는 ["user"]다. queryFn은 res.data.body인 { id, username, email }를 돌려준다
- form useState는 그대로 둔다. useEffect가 user가 오면 아이디와 이메일을 채우고 새 비밀번호는 비운다
- 수정 useMutation은 onSuccess(res)에서 setQueryData(["user"], res.data.body)로 넣고 홈으로 간다. 응답이 조회와 모양이 같다

Header.jsx
- useQueryClient로 queryClient를 꺼낸다
- handleLogout에서 logout 다음에 queryClient.clear를 부르고 홈으로 간다

## 핵심 코드
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 받은 데이터를 1분 동안 fresh로 본다
      // refetchOnWindowFocus는 기본값 true다. 탭이 다시 보이면 지금 화면의 stale 데이터만 다시 받는다
    },
  },
});

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools />
</QueryClientProvider>

const { data: boards = [] } = useQuery({
  queryKey: ["boards", "list"],
  queryFn: async () => {
    const res = await http.get("/?page=0");
    return res.data.body.boards;
  },
});

const updateBoard = useMutation({
  mutationFn: () => http.put(`/api/boards/${id}`, form),
  onSuccess: async () => {
    // 목록 키를 무효화한다
    // 목록을 쓰는 화면이 지금 없어서 이 키는 inactive다
    // 기본값은 active인 키만 다시 받으니, "all"을 줘서 안 보이는 목록도 지금 받게 한다
    // 기다리지 않는다. 지금 갈 곳은 상세이고, 목록은 홈에 가기 전에 받아 두면 된다
    queryClient.invalidateQueries({ queryKey: ["boards", "list"], refetchType: "all" });
    // 상세 키를 무효화한다
    // 이 수정 화면도 위 useQuery에서 같은 상세 키를 쓰고 있다
    // 화면에 떠 있는 useQuery가 쓰는 키는 active라서, 기본값만으로 지금 바로 다시 받는다
    // 다 받은 뒤 이동한다. 그래야 상세 화면에 옛 제목이 잠깐도 보이지 않는다
    await queryClient.invalidateQueries({ queryKey: ["boards", "detail", id] });
    navigate(`/board/${id}`);
  },
});

const deleteBoard = useMutation({
  mutationFn: () => http.delete(`/api/boards/${id}`),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ["boards", "list"], refetchType: "all" });
    navigate("/", { replace: true });
  },
});

const updateUser = useMutation({
  mutationFn: () => http.put("/api/user", { email: form.email, password: form.password }),
  onSuccess: (res) => {
    queryClient.setQueryData(["user"], res.data.body);
    navigate("/");
  },
});

logout();
queryClient.clear();
navigate("/");

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | main.jsx |
| S2 | Home.jsx, Detail.jsx, UpdateForm.jsx, UserInfo.jsx |
| S3 | main.jsx, Home.jsx |
| S4 | UpdateForm.jsx, Detail.jsx |
| S5 | main.jsx |
| S6 | SaveForm.jsx |
| S7 | UpdateForm.jsx |
| S8 | Detail.jsx |
| S9 | Detail.jsx |
| S10 | UserInfo.jsx |
| S11 | Header.jsx |

## 라이브러리
- 추가 없음. @tanstack/react-query와 @tanstack/react-query-devtools 5.101.2는 contract.md에 있다

## 다른 장 파일
- project-setup: main.jsx
- board-save: Home.jsx
- reply: Detail.jsx
- board-update-delete: UpdateForm.jsx
- component-split: SaveForm.jsx
- my-info: UserInfo.jsx
- login: Header.jsx
