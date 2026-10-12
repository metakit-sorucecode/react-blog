# server-node API

주소: http://localhost:8080
프론트는 http://localhost:5173에서만 부를 수 있다. 서버 CORS가 이 주소만 허용한다.

## 한눈에 보기

| 방법 | 주소 | 하는 일 | 로그인 | 쓰는 장 |
|---|---|---|---|---|
| POST | /join | 회원가입 | 아니오 | join |
| POST | /login | 로그인 | 아니오 | login |
| GET | /?page=&keyword= | 글 목록 | 선택 | board-list, paging-search |
| GET | /api/boards/:id | 글 상세와 댓글 | 선택 | board-detail |
| POST | /api/boards | 글쓰기 | 필요 | board-save |
| PUT | /api/boards/:id | 글 수정 | 필요 | board-update-delete |
| DELETE | /api/boards/:id | 글 삭제 | 필요 | board-update-delete |
| POST | /api/replies | 댓글 쓰기 | 필요 | reply |
| DELETE | /api/replies/:id | 댓글 삭제 | 필요 | reply |
| GET | /api/user | 내 정보 | 필요 | my-info |
| PUT | /api/user | 내 정보 수정 | 필요 | my-info |

- 선택: 토큰이 없어도 된다. 토큰을 보내면 owner가 내 글인지 알려 준다
- 필요: 토큰이 없거나 틀리면 401이다

## 공통

응답은 모두 같은 모양이다.

```json
{ "status": 200, "msg": "성공", "body": {} }
```

- 실패하면 status가 400, 401, 403, 404 중 하나이고 msg에 이유가 있다. body는 null이다
- 로그인이 필요한 요청은 헤더에 토큰을 붙인다

```
Authorization: Bearer eyJhbGciOi...
```

- 토큰 안에는 id와 username이 들어 있다. 7일 뒤 만료된다
- 시드 계정: ssar, cos, love (비밀번호 1234)
- 데이터를 처음으로 되돌리려면 server-node/db.json을 지우고 서버를 다시 띄운다

## 회원가입

POST /join

```json
요청 { "username": "kim", "password": "1234", "email": "kim@nate.com" }
응답 body { "id": 4, "username": "kim", "email": "kim@nate.com" }
```

- 400 입력값이 필요합니다: 세 값 중 빈 것이 있다
- 400 이미 존재하는 유저네임입니다

## 로그인

POST /login

```json
요청 { "username": "ssar", "password": "1234" }
응답 body null
```

- 토큰은 body가 아니라 응답 헤더 Authorization에 Bearer와 함께 온다
- 서버가 이 헤더를 열어 두어서 프론트에서 읽을 수 있다
- 400 아이디 또는 비밀번호가 틀렸습니다

## 글 목록

GET /?page=0&keyword=제목

- page는 0부터 센다. 한 쪽에 3개다
- keyword는 제목에 들어 있는 글만 찾는다. 비우면 모두다
- 최신 글이 먼저 온다

```json
응답 body {
  "totalPage": 2,
  "number": 0,
  "isFirst": true,
  "isLast": false,
  "boards": [{ "id": 4, "title": "제목4" }]
}
```

## 글 상세

GET /api/boards/:id

```json
응답 body {
  "id": 4,
  "title": "제목4",
  "content": "내용4",
  "userId": 3,
  "username": "love",
  "owner": false,
  "replies": [
    { "id": 1, "comment": "댓글1", "userId": 1, "username": "ssar", "owner": true }
  ]
}
```

- 위 예시는 ssar 토큰으로 /api/boards/4를 받은 것이다
- owner는 토큰의 사용자가 쓴 글과 댓글이면 true다. 토큰이 없으면 false다
- 404 게시글을 찾을 수 없습니다

## 글쓰기

POST /api/boards

```json
요청 { "title": "새 제목", "content": "새 내용" }
응답 body { "id": 5, "title": "새 제목", "content": "새 내용" }
```

- 400 제목과 내용이 필요합니다

## 글 수정

PUT /api/boards/:id

```json
요청 { "title": "고친 제목", "content": "고친 내용" }
응답 body { "id": 1, "title": "고친 제목", "content": "고친 내용" }
```

- 403 권한이 없습니다: 남의 글이다
- 404 게시글을 찾을 수 없습니다

## 글 삭제

DELETE /api/boards/:id

- 응답 body는 null이다. 그 글의 댓글도 함께 지워진다
- 403 권한이 없습니다
- 404 게시글을 찾을 수 없습니다

## 댓글 쓰기

POST /api/replies

```json
요청 { "comment": "좋아요", "boardId": 1 }
응답 body { "id": 5, "comment": "좋아요", "userId": 1, "username": "ssar", "owner": true }
```

- 400 댓글 내용이 필요합니다

## 댓글 삭제

DELETE /api/replies/:id

- 응답 body는 null이다
- 403 권한이 없습니다
- 404 댓글을 찾을 수 없습니다

## 내 정보

GET /api/user

```json
응답 body { "id": 1, "username": "ssar", "email": "ssar@nate.com" }
```

## 내 정보 수정

PUT /api/user

```json
요청 { "email": "new@nate.com", "password": "" }
응답 body { "id": 1, "username": "ssar", "email": "new@nate.com" }
```

- password를 비우면 비밀번호는 그대로다
- username은 바꿀 수 없다
