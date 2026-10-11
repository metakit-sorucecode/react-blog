# screens 흐름

```mermaid
flowchart LR
  A[헤더 메뉴] --> B[홈 카드 3개]
  B -->|제목 클릭| C[**상세**]
  C -->|수정 클릭| D[글 수정]
  A --> E[글쓰기]
  A --> F[로그인]
  A --> G[회원가입]
  A --> H[내 정보]
```
