# 점검

| 점검 | 결과 |
|---|---|
| 장 상태 | 맞음. project-setup부터 react-query까지 열네 장 모두 tasks.md가 체크됐고 done 태그가 있다. react-query는 주석 fix 12개를 더했고 patch가 fixes/에 있다 |
| 진행 중 | 맞음. error-handling 하나가 진행 중이다. spec을 쓰는 중이다 |
| 장 자료 | 맞음. 열네 장 모두 captures.md, tree.md, summary-code.md, 장 끝 사진이 있다 |
| 사진 | 맞음. captures.md의 파일 132개가 모두 있다. 다시 찍지 못한 사진은 없다 |
| 미룬 것 | 6개 모두 장을 정하지 않았다 |
| 테스트 | 70개 중 69개가 통과한다. project-setup S4가 실패한다 |

## 어긋난 것
- project-setup: S4 테스트가 실패한다. git에 없는 react-blog/README.md가 있어서다. 코드 문제가 아니고 사용자가 손으로 만든 파일이라 남겨 둔다. tests/project-setup/project-setup.spec.js
- login: tree.md가 done/join과 비교해서 JoinForm.jsx와 API.md도 표시한다. 둘은 join 수정과 API 문서 커밋에서 바뀌었다. .projectcode/chapters/login/diagrams/tree.md
- board-update-delete: tree.md가 done/board-save와 비교해서 SaveForm.jsx도 고침으로 표시한다. component-split 수정 커밋 4c0da83에서 바뀌었다. .projectcode/chapters/board-update-delete/diagrams/tree.md
- react-query: 사진사의 capture.mjs가 링크 클릭과 뒤로 가기를 못 해서 S3, S4, S5, S6, S7 뒷부분, S8 뒤로 가기, S10 뒷부분, S11은 사진으로 보이지 못했다. 동작은 자동 테스트가 확인한다. .projectcode/chapters/react-query/captures/captures.md
