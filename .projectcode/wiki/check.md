# 점검

| 점검 | 결과 |
|---|---|
| 장 상태 | 맞음. project-setup부터 board-save까지 열 장 모두 tasks.md가 체크됐고 done 태그가 있다 |
| 진행 중 | 맞음. 진행 중인 장이 없다 |
| 장 자료 | 맞음. 열 장 모두 captures.md, tree.md, summary-code.md, 장 끝 사진이 있다 |
| 사진 | 맞음. captures.md의 파일 70개가 모두 있다 |
| 미룬 것 | 5개 모두 장을 정하지 않았다 |
| 테스트 | 44개 중 43개가 통과한다. project-setup S4가 실패한다 |

## 어긋난 것
- project-setup: S4 테스트가 실패한다. git에 없는 react-blog/README.md가 있어서다. 사용자가 파일을 남기기로 했다. tests/project-setup/project-setup.spec.js
- login: tree.md가 done/join과 비교해서 JoinForm.jsx와 API.md도 표시한다. 둘은 join 수정과 API 문서 커밋에서 바뀌었다. .projectcode/chapters/login/diagrams/tree.md
- board-list: S1, S2 테스트가 목록 API를 받은 직후 화면과 비교한다. 그 사이 board-save 테스트가 새 글을 만들면 어긋날 수 있다. 아직 실패한 적은 없다. tests/board-list/board-list.spec.js
