import { test, expect } from "@playwright/test";
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const blog = path.join(root, "react-blog");
const src = path.join(blog, "src");

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full) : [path.relative(src, full)];
  });
}

// 색 글자(oklch 등)를 캔버스에 칠해 rgb 밝기로 바꾼다
async function brightness(page, selector, property) {
  return page.evaluate(
    ({ selector, property }) => {
      const color = getComputedStyle(document.querySelector(selector))[property];
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return (r + g + b) / 3;
    },
    { selector, property }
  );
}

test("S1 react-blog 개발 서버를 띄우면 5173 주소에 첫 화면이 보인다", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link").first()).toBeVisible();
});

test("S2 첫 화면은 흰 바탕에 검정 글자로 보인다. 스타일 도구가 연결됐다는 확인이다", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link").first()).toBeVisible();

  expect(await brightness(page, "html", "backgroundColor")).toBeGreaterThan(240);
  expect(await brightness(page, "body", "color")).toBeLessThan(80);
});

test("S3 소스 폴더의 코드 파일은 모두 .jsx이고 스타일 파일은 index.css 하나다", () => {
  const files = listFiles(src);
  const others = files.filter((file) => !file.endsWith(".jsx") && file !== "index.css");
  expect(others).toEqual([]);
  expect(files).toContain("index.css");
});

test("S4 옛 코드, 예제 데이터, 빌드 결과, 옛 안내 문서가 남아 있지 않다", () => {
  const leftovers = [
    "dist",
    "GUIDE.md",
    "README.md",
    "src/app",
    "src/features",
    "src/shared",
    "src/test",
  ].filter((name) => existsSync(path.join(blog, name)));
  expect(leftovers).toEqual([]);
});

test("S5 포맷 명령 하나로 코드 모양을 맞춘다", () => {
  // 모양이 흐트러진 임시 파일을 두고 포맷 명령이 고치는지 본다
  const messy = path.join(src, "format-check.jsx");
  writeFileSync(messy, "const   a='x'\n");
  try {
    execSync("npm run format", { cwd: blog, stdio: "pipe" });
    expect(readFileSync(messy, "utf8")).toBe('const a = "x";\n');
  } finally {
    rmSync(messy, { force: true });
  }
});

test("S6 루트 테스트 명령이 서버와 프론트를 함께 띄운다", async ({ page, request }) => {
  const res = await request.get("http://localhost:8080/");
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(Array.isArray(json.body.boards)).toBeTruthy();

  const front = await page.goto("/");
  expect(front.ok()).toBeTruthy();
});
