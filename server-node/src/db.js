import { Low, Memory } from "lowdb";
import { JSONFile } from "lowdb/node";
import bcrypt from "bcryptjs";

// 시드 데이터 (Spring data.sql 재현)
function seedData() {
  const pw = bcrypt.hashSync("1234", 10);
  const users = [
    { id: 1, username: "ssar", password: pw, email: "ssar@nate.com" },
    { id: 2, username: "cos", password: pw, email: "cos@nate.com" },
    { id: 3, username: "love", password: pw, email: "love@nate.com" },
  ];
  const boards = [
    { id: 1, title: "제목1", content: "내용1", userId: 1 },
    { id: 2, title: "제목2", content: "내용2", userId: 1 },
    { id: 3, title: "제목3", content: "내용3", userId: 2 },
    { id: 4, title: "제목4", content: "내용4", userId: 3 },
  ];
  const replies = [
    { id: 1, comment: "댓글1", boardId: 4, userId: 1 },
    { id: 2, comment: "댓글2", boardId: 4, userId: 1 },
    { id: 3, comment: "댓글3", boardId: 4, userId: 2 },
    { id: 4, comment: "댓글4", boardId: 3, userId: 2 },
  ];
  return { users, boards, replies, seq: { user: 3, board: 4, reply: 4 } };
}

// 테스트는 Memory 어댑터, 실행은 파일 어댑터
const isTest = process.env.NODE_ENV === "test";
const adapter = isTest ? new Memory() : new JSONFile("db.json");
export const db = new Low(adapter, seedData());

export async function initDb() {
  await db.read();
  if (!db.data) db.data = seedData();
  await db.write();
}

export async function resetDb() {
  db.data = seedData();
  await db.write();
}

export function nextId(kind) {
  db.data.seq[kind] += 1;
  return db.data.seq[kind];
}
