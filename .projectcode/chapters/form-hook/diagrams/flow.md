# form-hook 흐름

폼 값은 react-hook-form이 맡는다. 입력칸은 register로 붙고, 가입하기는 handleSubmit이 받는다.
회원가입 비밀번호는 칠 때마다 4자 규칙을 검사한다. 빈 칸은 검사하지 않고 지금처럼 서버가 막는다.
규칙에 걸리면 요청 없이 그 칸으로 커서가 간다. 맞으면 폼 값 data를 onSubmit에 넘겨 보낸다.

```mermaid
sequenceDiagram
  participant U as 사용자
  participant F as react-hook-form
  participant S as onSubmit
  participant B as 서버
  U->>F: 비밀번호 입력 (register)
  F->>F: **칠 때마다 검사** (onChange)
  alt 3자 이하
    F-->>U: **칸 아래 빨간 문구** (errors)
    U->>F: 가입하기 클릭
    F-->>U: 요청 없이 그 칸에 커서
  else 4자 이상이거나 빈 칸
    U->>F: 가입하기 클릭 (handleSubmit)
    F->>S: 폼 값 data
    S->>B: POST /join
    B-->>S: 성공이면 로그인 화면으로
  end
```

글 수정과 내 정보는 서버 값이 오면 reset(값)으로 채운다. 댓글은 등록 뒤 reset()으로 비운다.

```mermaid
flowchart LR
  A[서버 값 도착] --> B["채우기 (reset(값))"]
  B --> C[입력칸에 값]
  D[댓글 등록 성공] --> E["비우기 (reset())"]
  E --> F[입력칸 빈칸]
```
