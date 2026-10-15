# react-query 흐름

화면은 서버 대신 캐시에 데이터를 묻는다.
키는 목록 ["boards", "list"], 상세와 글 수정 ["boards", "detail", id], 내 정보 ["user"]다.
쓰기 뒤 캐시 처리는 글쓰기와 삭제는 목록 무효화, 글 수정은 상세와 목록 무효화, 댓글은 상세 무효화, 내 정보는 setQueryData다.

```mermaid
sequenceDiagram
  participant U as 사용자
  participant S as 화면
  participant Q as 캐시
  participant B as 서버
  U->>S: 화면에 들어감
  S->>Q: 키로 찾기 (useQuery)
  alt 받은 지 1분 안
    Q-->>S: **캐시로 바로 그림**
  else 없거나 1분 지남
    Q->>B: GET 요청
    B-->>Q: 데이터를 키에 담기
    Q-->>S: 그림
  end
  U->>S: 쓰기 버튼 클릭
  S->>B: 쓰기 요청 (useMutation)
  B-->>S: 200
  S->>Q: **무효화 또는 setQueryData**
  Q->>B: 무효화한 키 다시 받기
  S-->>U: 받은 뒤 이동
  U->>S: 로그아웃 클릭
  S->>Q: **캐시 비우기** (clear)
```
