# 점검

| 점검 | 결과 |
|---|---|
| 장 상태 | 맞음. project-setup부터 login까지 여덟 장 모두 tasks.md가 체크됐고 done 태그가 있다 |
| 진행 중 | 맞음. 진행 중인 장이 없다 |
| 장 자료 | 맞음. 여덟 장 모두 captures.md, tree.md, summary-code.md, 장 끝 사진이 있다 |
| 사진 | 맞음. captures.md의 파일 60개가 모두 있다 |
| 미룬 것 | 4개 모두 장을 정하지 않았다 |
| 테스트 | 37개 중 36개가 통과한다. project-setup S4가 실패한다 |

## 어긋난 것
- project-setup: S4 테스트가 실패한다. git에 없는 react-blog/README.md가 있어서다. 사용자가 파일을 남기기로 했다. tests/project-setup/project-setup.spec.js
- board-detail: S1 테스트가 첫 실행에서 5초 안에 상세 요청을 보지 못해 실패할 수 있다. 두 장 연속 첫 실행에서 나왔고 다시 돌리면 통과한다. tests/board-detail/board-detail.spec.js
- login: tree.md가 done/join과 비교해서 JoinForm.jsx와 API.md도 표시한다. 둘은 join 수정과 API 문서 커밋에서 바뀌었다. .projectcode/chapters/login/diagrams/tree.md
