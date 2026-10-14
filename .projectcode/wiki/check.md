# 점검

| 점검 | 결과 |
|---|---|
| 장 상태 | 맞음. project-setup부터 board-update-delete까지 열한 장 모두 tasks.md가 체크됐고 done 태그가 있다 |
| 진행 중 | 맞음. 진행 중인 장이 없다 |
| 장 자료 | 맞음. 열한 장 모두 captures.md, tree.md, summary-code.md, 장 끝 사진이 있다 |
| 사진 | 맞음. captures.md의 파일 78개가 모두 있다. 다시 찍지 못한 사진은 없다 |
| 미룬 것 | 6개 모두 장을 정하지 않았다 |
| 테스트 | 49개 중 48개가 통과한다. project-setup S4가 실패한다 |

## 어긋난 것
- project-setup: S4 테스트가 실패한다. git에 없는 react-blog/README.md가 있어서다. 사용자가 파일을 남기기로 했다. tests/project-setup/project-setup.spec.js
- login: tree.md가 done/join과 비교해서 JoinForm.jsx와 API.md도 표시한다. 둘은 join 수정과 API 문서 커밋에서 바뀌었다. .projectcode/chapters/login/diagrams/tree.md
- board-update-delete: tree.md가 done/board-save와 비교해서 SaveForm.jsx도 고침으로 표시한다. component-split 수정 커밋 4c0da83에서 바뀌었다. .projectcode/chapters/board-update-delete/diagrams/tree.md
- board-save: S3 테스트가 전체 실행 때 한 번 실패했다. board-update-delete 테스트가 동시에 새 글을 만들어 맨 위 글이 바뀐 것으로 보인다. 다시 돌리면 통과한다. tests/board-save/board-save.spec.js
