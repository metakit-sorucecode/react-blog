import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  use: { baseURL: "http://localhost:5173" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      // db.json을 지워 시드 상태로 띄운다
      command: `node -e "require('fs').rmSync('db.json', { force: true })" && npm start`,
      cwd: "server-node",
      url: "http://localhost:8080/",
      reuseExistingServer: true,
    },
    {
      command: "npm run dev",
      cwd: "react-blog",
      url: "http://localhost:5173",
      reuseExistingServer: true,
    },
  ],
});
