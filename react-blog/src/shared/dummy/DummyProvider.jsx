import { createContext, useContext, useState } from "react";
import * as db from "./db";

// 🟡 가짜 백엔드 - 데이터는 메모리(useState)에만 있어서 새로고침하면 처음으로 돌아간다.
//    강의에서 이 함수들을 하나씩 서버 API(axios) 호출로 바꿔 나간다.

const PAGE_SIZE = 5;

const DummyContext = createContext(null);

export function DummyProvider({ initialUser = null, children }) {
  const [users, setUsers] = useState(db.users);
  const [boards, setBoards] = useState(db.boards);
  const [replies, setReplies] = useState(db.replies);
  const [me, setMe] = useState(initialUser);

  const nextId = (list) => Math.max(0, ...list.map((x) => x.id)) + 1;

  // ---- 인증 ----
  function login(username, password) {
    const user = users.find((u) => u.username === username && u.password === password);
    if (!user) return false;
    setMe(user);
    return true;
  }

  function logout() {
    setMe(null);
  }

  function join({ username, password, email }) {
    if (users.some((u) => u.username === username)) return false;
    setUsers([...users, { id: nextId(users), username, password, email }]);
    return true;
  }

  function updateMe({ email, password }) {
    const updated = { ...me, email, password: password || me.password };
    setUsers(users.map((u) => (u.id === me.id ? updated : u)));
    setMe(updated);
  }

  // ---- 게시글 ----
  function getBoards(page, keyword) {
    const filtered = [...boards]
      .reverse()
      .filter((b) => b.title.includes(keyword));
    const totalPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    return {
      totalPage,
      number: page,
      isFirst: page === 0,
      isLast: page >= totalPage - 1,
      boards: filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    };
  }

  function getBoard(id) {
    const board = boards.find((b) => b.id === Number(id));
    if (!board) return null;
    return {
      ...board,
      owner: me?.id === board.userId,
      replies: replies
        .filter((r) => r.boardId === board.id)
        .map((r) => ({ ...r, owner: me?.id === r.userId })),
    };
  }

  function saveBoard({ title, content }) {
    const board = { id: nextId(boards), title, content, userId: me.id, username: me.username };
    setBoards([...boards, board]);
    return board;
  }

  function updateBoard({ id, title, content }) {
    setBoards(boards.map((b) => (b.id === Number(id) ? { ...b, title, content } : b)));
  }

  function deleteBoard(id) {
    setBoards(boards.filter((b) => b.id !== Number(id)));
    setReplies(replies.filter((r) => r.boardId !== Number(id)));
  }

  // ---- 댓글 ----
  function saveReply({ comment, boardId }) {
    const reply = {
      id: nextId(replies),
      boardId: Number(boardId),
      comment,
      userId: me.id,
      username: me.username,
    };
    setReplies([...replies, reply]);
  }

  function deleteReply(id) {
    setReplies(replies.filter((r) => r.id !== id));
  }

  const value = {
    me,
    isLogin: me != null,
    login,
    logout,
    join,
    updateMe,
    getBoards,
    getBoard,
    saveBoard,
    updateBoard,
    deleteBoard,
    saveReply,
    deleteReply,
  };

  return <DummyContext.Provider value={value}>{children}</DummyContext.Provider>;
}

export function useDummy() {
  return useContext(DummyContext);
}
