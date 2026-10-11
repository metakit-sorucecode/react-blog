# 점검

| 점검 | 결과 |
|---|---|
| 장 상태 | 맞음. project-setup, layout, screens, component-split, board-list, board-detail 모두 tasks.md가 체크됐고 done 태그가 있다 |
| 진행 중 | 맞음. 진행 중인 장이 없다 |
| 장 자료 | 맞음. 여섯 장 모두 captures.md, tree.md, summary-code.md, 장 끝 사진이 있다 |
| 사진 | 맞음. captures.md의 파일 46개가 모두 있다 |
| 미룬 것 | 3개 모두 장을 정하지 않았다 |
| 테스트 | 29개 모두 통과한다. 서버를 막 띄운 첫 실행에서 board-detail S1이 한 번 실패했다 |

## 어긋난 것
- board-detail: S1 테스트가 첫 실행에서 5초 안에 상세 요청을 보지 못해 실패할 수 있다. 다시 돌리면 통과한다. tests/board-detail/board-detail.spec.js
