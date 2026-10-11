import { createApp } from "./app.js";
import { initDb } from "./db.js";

const PORT = 8080;
await initDb();
createApp().listen(PORT, () => {
  console.log(`✅ 블로그 서버 실행: http://localhost:${PORT}`);
  console.log(`   시드 계정: ssar / 1234`);
});
