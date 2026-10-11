// 🟡 더미 데이터 - 서버 응답(body)과 같은 모양으로 만들어 두었다.
//    나중에 axios 로 서버를 붙이면 이 파일은 필요 없어진다.

export const users = [
  { id: 1, username: "ssar", password: "1234", email: "ssar@nate.com" },
  { id: 2, username: "cos", password: "1234", email: "cos@nate.com" },
];

const titles = [
  "리액트 시작하기",
  "Vite 로 프로젝트 만들기",
  "컴포넌트와 props",
  "useState 로 상태 다루기",
  "useEffect 언제 쓰나",
  "React Router 로 화면 이동",
  "폼 입력 다루기",
  "Tailwind 와 DaisyUI",
  "목록 렌더링과 key",
  "조건부 렌더링",
  "Context 로 상태 공유",
  "배포 준비하기",
];

export const boards = titles.map((title, i) => {
  const id = i + 1;
  const writer = users[i % 2];
  return {
    id,
    title,
    content: `${title} 에 대한 본문입니다.\n\n이 글은 화면 확인용 더미 데이터입니다.\n여러 줄도 그대로 보입니다.`,
    userId: writer.id,
    username: writer.username,
  };
});

export const replies = [
  { id: 1, boardId: 12, comment: "좋은 글 감사합니다!", userId: 2, username: "cos" },
  { id: 2, boardId: 12, comment: "다음 글도 기대할게요", userId: 1, username: "ssar" },
  { id: 3, boardId: 11, comment: "Context 정리 깔끔하네요", userId: 1, username: "ssar" },
  { id: 4, boardId: 10, comment: "질문 있습니다", userId: 2, username: "cos" },
];
