# paging-search 흐름

목록 키는 ["boards", "list", { page, keyword }]다. 페이지와 검색어마다 캐시 칸이 따로 생긴다.
검색어가 바뀌면 page를 0으로 돌려 첫 페이지부터 본다.
처음 보는 키는 placeholderData로 앞 키의 목록을 보인 채 받는다. 로딩으로 바뀌지 않아 검색창의 커서가 남는다.

```mermaid
sequenceDiagram
  participant U as 사용자
  participant H as Home
  participant Q as 캐시
  participant B as 서버
  U->>H: 검색어 입력이나 이전, 다음
  H->>Q: **새 키** { page, keyword }
  alt 1분 안에 본 키
    Q-->>H: 캐시 목록을 바로 그림
  else 처음 보는 키
    Q-->>H: **이전 목록 유지** (placeholderData)
    Q->>B: GET /?page=&keyword=
    B-->>Q: 글 목록과 쪽 정보
    Q-->>H: 새 목록과 쪽 번호
  end
```

글을 쓰거나 고치거나 지우면 ["boards", "list"]를 무효화한다. 앞부분이 같은 모든 페이지와 검색 키에 걸린다.

```mermaid
flowchart LR
  A[쓰기 성공] --> B["목록 무효화 (refetchType all)"]
  B --> C[**모든 페이지 다시 받기**]
  C --> D[다음 누르면 바로 보임]
```
